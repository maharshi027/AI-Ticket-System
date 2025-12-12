import { inngest } from "../client"
import User from '../../models/user.js' 
import { NonRetriableError } from "inngest"
import { sendMail } from "../../utils/mailer"

export const onUserSignUp = inngest.createFunction(
    {id: "on-user-signup", retries: 2},
    {event: "user/signup"},
    async({event, step}) =>{
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async() => {
            const userObject = await User.findOne({email})

            if(!userObject){
                throw new NonRetriableError("User no longer exixts in our database")
            }
            return userObject;
            })

            await step.run("send-welcome-email", async()=>{
                const subject = `Welcome to the App`
                const message = `Hi,
                \n\n
                Thanks for signup. We're glad to have you onboard!
                `

                await sendMail(user.email, subject, message)
            })

            return {success: true}
        } catch (error) {
            console.log("Error running step", error.message);
            return {success: false}
        }
    }
)