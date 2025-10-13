import { Router } from "express";
import * as productControllers from "../controllers/productControllers.js";
import multer from "multer";
import path from "path";

export const productRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}_${Math.random()}${ext}`);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/"))
    {
        cb(null, true);
    }
    else
    {
        cb(new Error("Only Image Files are Allowed"), false);
    }
}

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, //5MB
// })

const upload = multer({ storage: multer.memoryStorage() });

productRouter.route("/add").post(upload.single("image"), productControllers.addProduct);
productRouter.route("/list").get(productControllers.listProducts);
productRouter.route("/remove").post(productControllers.removeProduct);
productRouter.route("/edit").post(upload.single("image"), productControllers.editProduct);
