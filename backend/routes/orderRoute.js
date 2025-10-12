import {Router} from "express"
import * as orderControllers from "../controllers/orderControllers.js";
import { verifyAuthentication } from "../middleware/verifyUserMiddleware.js";

export const orderRouter = Router();

orderRouter.route("/place").post(verifyAuthentication, orderControllers.placeOrder);
orderRouter.route("/verify").post(verifyAuthentication, orderControllers.verifyOrder);
orderRouter.route("/userorders").post(verifyAuthentication, orderControllers.userOrders);
orderRouter.route("/list").get(orderControllers.listOrders);
orderRouter.route("/status").post(orderControllers.updateStatus);
orderRouter.route("/cod").post(verifyAuthentication, orderControllers.placeOrderCashOnDelivery);
orderRouter.route("/cancel").post(verifyAuthentication, orderControllers.cancelOrder);
