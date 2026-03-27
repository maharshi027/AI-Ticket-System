import express from 'express'
import { authenticate } from '../middlewares/auth.js';
import { createTicket, getTickets, getTicket, updateTicket, getTicketStats, getTicketHistory } from '../controllers/ticket.controller.js';

const router = express.Router()

router.post("/", authenticate, createTicket)
router.get("/", authenticate, getTickets)
router.get("/stats", authenticate, getTicketStats)
router.get("/:id", authenticate, getTicket)
router.get("/:id/history", authenticate, getTicketHistory)
router.patch("/:id", authenticate, updateTicket)

export default router ;