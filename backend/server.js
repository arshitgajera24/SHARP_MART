import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import requestIp from "request-ip";
import cookieParser from "cookie-parser";
import { productRouter } from "./routes/productRoute.js";
import { githubRouter, userRouter } from "./routes/userRoute.js";
import { verifyAuthentication } from "./middleware/verifyUserMiddleware.js";
import { cartRouter } from "./routes/cartRoute.js";
import { orderRouter } from "./routes/orderRoute.js";
import { contactRouter } from "./routes/contactRoute.js";
dotenv.config();

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ["GET, POST, PUT, DELETE, PUT, PATCH"],
    credentials: true,
}));


app.use(cookieParser());
app.use(requestIp.mw());

app.use(express.static("public"));
app.use("/images", express.static("uploads"));
app.use("/api/product", productRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", verifyAuthentication, cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use(githubRouter);


app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
})

app.listen(port, () => {
    console.log(`🚀 Server Running at http://localhost:${port}`);
})
