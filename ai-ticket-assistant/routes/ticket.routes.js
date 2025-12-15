import express from 'express'
import { authenticate } from '../middlewares/auth';
import { createTicket, getTickets, getTicket,  } from '../controllers/ticket.controller.js';

const router = express.Router()

router.post("/", authenticate, createTicket)
router.get("/", authenticate, getTickets)
router.get("/:id", authenticate, getTicket)

export default router ;