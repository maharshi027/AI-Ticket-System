import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { serve } from "inngest/express";
import userRoutes from "./routes/user.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/functions/onSignup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest", serve({
  client: inngest,
  functions: [onUserSignUp, onTicketCreated]
}));
mongoose
  .connect(process.env.MOGNO_URI)
  .then(() => {
    console.log("MongoDB connected successfully !");
    app.listen(PORT, () =>
      console.log(`Server is running at Port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log("MongoDB Error ", err));
