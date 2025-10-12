import * as contactServices from "../services/contactServices.js";
import { contactValidatorSchema } from "../validators/contactValidators.js";

export const sendContact = async (req, res) => {
    try {
        
        const {data, error} = contactValidatorSchema.safeParse(req.body);

        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { fullName, email, subject, message } = data;

        const contactId = await contactServices.addNewContact({fullName, email, subject, message});
        console.log(contactId);
        res.json({success: true, message: "Message Sent Successfully"});

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const getContacts = async (req, res) => {
    try {
        const contacts = await contactServices.getAllContacts();
        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const deleteContacts = async (req, res) => {
    try {
        const {contactId} = req.body;
        await contactServices.deleteContactById(contactId);
        res.json({ success: true, message: "Contact Message Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}