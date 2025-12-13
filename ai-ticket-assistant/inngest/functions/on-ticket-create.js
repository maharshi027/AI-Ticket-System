import { inngest } from "../client"
import User from '../../models/user.js' 
import { NonRetriableError } from "inngest"
import { sendMail } from "../../utils/mailer"

export const onTicketCreated = inngest.createFunction(
    {},
    {},
    async({event, step}) => {
        try {
            const {ticketId} = event.data
        } catch (error) {
            
        }
    }
)