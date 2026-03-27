import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { createNote, getNotesByTicket } from '../controllers/note.controller.js';

const router = express.Router();

router.post("/:ticketId", authenticate, createNote);
router.get("/:ticketId", authenticate, getNotesByTicket);

export default router;
