import Ticket from "../models/ticket.js";
import TicketHistory from "../models/ticketHistory.js";
import User from "../models/user.js";
import { sendMail } from "../utils/mailer.js";


export const createTicket = async (req, res) => {
  try {
    const { title, description, relatedSkills } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title & Description are mandatory" });
    }

    let assignedTo = null;
    let assignedUser = null;
    if (relatedSkills && relatedSkills.length > 0) {
      assignedUser = await User.findOne({
        role: { $in: ["admin", "moderator"] },
        skills: { $in: relatedSkills }
      });
      if (assignedUser) {
        assignedTo = assignedUser._id;
      }
    }

    const newTicket = await Ticket.create({
      title,
      description,
      relatedSkills,
      assignedTo,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    if (assignedUser) {
      sendMail(assignedUser.email, "New Auto-Assigned Ticket", `You have been automatically assigned to a new ticket: ${title}\nDescription: ${description}`).catch(console.error);
    }

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, search } = req.query;
    let query = {};
    
    if (user.role === "user") {
      query.createdBy = user._id;
    }
    
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const totalTickets = await Ticket.countDocuments(query);
    const totalPages = Math.ceil(totalTickets / limit);

    let tickets;
    if (user.role !== "user") {
      tickets = await Ticket.find(query)
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      tickets = await Ticket.find(query)
        .select("title description status createdAt priority")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    return res.status(200).json({
      tickets,
      pagination: {
        totalTickets,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description status createdAt");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority, title, description } = req.body;
    
    // Admins can update any ticket, Users can only update their own
    const filter = req.user.role === "admin" ? { _id: id } : { _id: id, createdBy: req.user._id };
    
    const ticket = await Ticket.findOne(filter);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket Not Found or unauthorized" });
    }

    const previousStatus = ticket.status;
    const previousAssignedTo = ticket.assignedTo?.toString();
    const changes = [];

    if (status && ticket.status !== status) {
      changes.push({ action: "Status Changed", oldValue: ticket.status, newValue: status });
      ticket.status = status;
    }
    if (assignedTo && req.user.role === "admin" && ticket.assignedTo?.toString() !== assignedTo) {
      changes.push({ action: "Assignment Changed", oldValue: ticket.assignedTo, newValue: assignedTo });
      ticket.assignedTo = assignedTo; // Only admins can assign
    }
    if (priority && req.user.role === "admin" && ticket.priority !== priority) {
      changes.push({ action: "Priority Changed", oldValue: ticket.priority, newValue: priority });
      ticket.priority = priority;
    }
    if (title && ticket.title !== title) {
      changes.push({ action: "Title Changed", oldValue: ticket.title, newValue: title });
      ticket.title = title;
    }
    if (description && ticket.description !== description) {
      changes.push({ action: "Description Changed", oldValue: ticket.description, newValue: description });
      ticket.description = description;
    }

    await ticket.save();

    if (changes.length > 0) {
      const historyEntries = changes.map(change => ({
        ticketId: id,
        changedBy: req.user._id,
        ...change
      }));
      await TicketHistory.insertMany(historyEntries);
    }

    if (status === "Done" && previousStatus !== "Done") {
      const creator = await User.findById(ticket.createdBy);
      if (creator) {
        sendMail(creator.email, "Ticket Resolved", `Your ticket "${ticket.title}" has been marked as Done!`).catch(console.error);
      }
    }

    if (assignedTo && req.user.role === "admin" && previousAssignedTo !== assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (assignee) {
        sendMail(assignee.email, "New Ticket Assigned", `You have been manually assigned to ticket: ${ticket.title}`).catch(console.error);
      }
    }

    const populatedTicket = await Ticket.findById(id).populate("assignedTo", ["email", "_id"]);
    
    return res.status(200).json({ message: "Ticket updated successfully", ticket: populatedTicket });
  } catch (error) {
    console.error("Error updating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "user") {
      return res.status(403).json({ message: "Access denied. Admins & Moderators only." });
    }

    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: { $ne: "Done" } });
    const resolvedTickets = await Ticket.countDocuments({ status: "Done" });

    // Count by priority
    const priorityStats = await Ticket.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Count by status
    const statusStats = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      totalTickets,
      openTickets,
      resolvedTickets,
      priorityStats,
      statusStats
    });
  } catch (error) {
    console.error("Error fetching ticket stats", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicketHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await TicketHistory.find({ ticketId: id })
      .populate("changedBy", ["email", "_id", "role"])
      .sort({ createdAt: -1 });
    
    return res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching ticket history", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
