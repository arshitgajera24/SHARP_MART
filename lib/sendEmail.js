import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_RESEND);

export const sendEmail = async ({to, subject, html}) => {
    try
    {
        const { data, error } = await resend.emails.send({
            from: "SHARP MART <website@resend.dev>",
            to: [to],
            subject,
            html,
        })

        if(error) 
        {
            return console.error({error});
        }
    }
    catch(error)
    {
        console.error(error.message);
    }
}