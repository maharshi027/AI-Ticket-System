import Note from "../models/note.js";

export const createNote = async (req, res) => {
  try {
    const { content } = req.body;
    const { ticketId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const note = await Note.create({
      ticket: ticketId,
      createdBy: req.user._id,
      content,
    });

    const populatedNote = await note.populate("createdBy", "email role");

    return res.status(201).json({ note: populatedNote });
  } catch (error) {
    console.error("Error creating note", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotesByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const notes = await Note.find({ ticket: ticketId })
      .populate("createdBy", "email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Error fetching notes", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
