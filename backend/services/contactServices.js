import { eq } from "drizzle-orm";
import { db } from "../config/db.js"
import { contactsTable } from "../drizzle/schema.js"

export const addNewContact = async ({fullName, email, subject, message}) => {
    const [newContact] = await db.insert(contactsTable).values({fullName, email, subject, message}).$returningId();
    return newContact.id;
}

export const getAllContacts = async () => {
    const contacts = await db.select().from(contactsTable);
    return contacts;
}

export const deleteContactById = async (contactId) => {
    return await db.delete(contactsTable).where(eq(contactsTable.id, contactId));
}