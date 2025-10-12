import {Router} from "express" 
import * as contactControllers from "../controllers/contactControllers.js";

export const contactRouter = Router();

contactRouter.route("/send").post(contactControllers.sendContact);
contactRouter.route("/get").get(contactControllers.getContacts);
contactRouter.route("/delete").post(contactControllers.deleteContacts);
