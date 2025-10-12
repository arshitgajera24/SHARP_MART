import {Router} from "express" 
import * as cartControllers from "../controllers/cartControllers.js";

export const cartRouter = Router();

cartRouter.route("/add").post(cartControllers.addToCart)
cartRouter.route("/decrease").post(cartControllers.DecreaseFromCart)
cartRouter.route("/remove").post(cartControllers.removeFromCart)
cartRouter.route("/get").post(cartControllers.getCart)
