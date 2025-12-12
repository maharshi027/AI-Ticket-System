import nodemailer from 'nodemailer'

export const sendMail = async (toString, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST, 
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth : {
                user : process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            }
        });

        const info = await transporter.sendMail({
            from: ' inngest TMS',
            to,
            subject,
            text,
        })

        console.log("Message Sent:", info.messageId);
           
    } catch (error) {
        console.log("Mail error", error.message);
        throw error;
        
    }
}