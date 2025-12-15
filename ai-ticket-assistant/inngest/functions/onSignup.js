import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignUp = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      if (!email) {
        throw new NonRetriableError("Email not found in event payload");
      }

      const user = await step.run("get-user-by-email", async () => {
        const userObject = await User.findOne({ email });

        if (!userObject) {
          throw new NonRetriableError(
            "User no longer exists in our database"
          );
        }

        return userObject;
      });

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to the App";
        const message = `Hi,

Thanks for signing up. We're glad to have you onboard!

Regards,
Team`;

        await sendMail(user.email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.error("Error running onUserSignUp:", error.message);
      return { success: false };
    }
  }
);
