import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const sendEmail = async ({to, subject, html}) => {
    try
    {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            subject,
            htmlContent: html,
            sender: { name: "SHARP MART", email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: to }],
        });

        console.log("Email sent successfully: ", response);
    }
    catch(error)
    {
        console.error("Error sending email: ", error.message);
        if (error.response) {
            console.error("Brevo Error Detail: ", error.response.body);
        }
    }
}
