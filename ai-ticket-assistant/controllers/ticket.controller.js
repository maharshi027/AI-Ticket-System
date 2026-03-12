import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";


export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title & Description are mandatory" });
    }

    const newTicket = await Ticket.create({
      title,
      description,
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
    let tickets = [];

    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
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

    if (status) ticket.status = status;
    if (assignedTo && req.user.role === "admin") ticket.assignedTo = assignedTo; // Only admins can assign
    if (priority && req.user.role === "admin") ticket.priority = priority;
    if (title) ticket.title = title;
    if (description) ticket.description = description;

    await ticket.save();

    const populatedTicket = await Ticket.findById(id).populate("assignedTo", ["email", "_id"]);
    
    return res.status(200).json({ message: "Ticket updated successfully", ticket: populatedTicket });
  } catch (error) {
    console.error("Error updating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
