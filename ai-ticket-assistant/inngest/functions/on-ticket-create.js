import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, {
          status: "To-Do",
        });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedSkills = await step.run("ai-processing", async () => {
        if (!aiResponse) return [];

        const priorityMap = ["Low", "Medium", "High"];
        const priority = priorityMap.includes(
          aiResponse.priority?.charAt(0).toUpperCase() +
            aiResponse.priority?.slice(1)
        )
          ? aiResponse.priority.charAt(0).toUpperCase() +
            aiResponse.priority.slice(1)
          : "Medium";

        await Ticket.findByIdAndUpdate(ticket._id, {
          priority,
          helpfulNotes: aiResponse.helpfulNotes || "",
          status: "In-Progress",
          relatedSkills: aiResponse.relatedSkills || [],
        });

        return aiResponse.relatedSkills || [];
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = null;

        if (relatedSkills.length) {
          user = await User.findOne({
            role: "moderator",
            skills: {
              $elemMatch: {
                $regex: relatedSkills.join("|"),
                $options: "i",
              },
            },
          });
        }

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      await step.run("send-email-notification", async () => {
        if (!moderator) return;

        const finalTicket = await Ticket.findById(ticket._id);

        await sendMail(
          moderator.email,
          "Ticket Assigned",
          `A new ticket "${finalTicket.title}" has been assigned to you.`
        );
      });

      return { success: true };
    } catch (error) {
      console.error("Error running ticket workflow:", error.message);
      return { success: false };
    }
  }
);
