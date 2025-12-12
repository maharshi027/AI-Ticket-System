import nodemailer from 'nodemailer'

export const sendMail = async (toString, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: MAILTRAP_SMTP_HOST, 
            port: MAILTRAP_SMTP_PORT,
            secure: false,
            auth : {
                user : MAILTRAP_SMTP_USER,
                pass: MAILTRAP_SMTP_PASS
            }
        })
    } catch (error) {
        
    }
}