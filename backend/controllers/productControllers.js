import fs from "fs";
import path from "path";
import {addProductValidatorSchema, editProductValidatorSchema} from "../validators/productValidators.js"
import * as productServices from "../services/productServices.js";

export const addProduct = async (req, res) => {
    try {
        const image_filename = req.file ? `${req.file.filename}` : `parcel_icon.png`;

        if (!req.file) {
            return res.json({ success: false, error: "Image is required" });
        }
        
        const parsedBody = {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            ratings: req.body.ratings ? Number(req.body.ratings) : 0,
            price: req.body.price ? Number(req.body.price) : 0,
            original_price: req.body.original_price ? Number(req.body.original_price) : 0,
            isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
        };

        const {data, error} = addProductValidatorSchema.safeParse(parsedBody);

        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const {name, category, description, price, original_price, ratings,isAvailable} = data;

        const existing = await productServices.findProductByName(name);

        if(existing.length > 0) {
            return res.json({ success: false, error: "Product already exists" });
        }
        
        const productId = await productServices.addNewProduct({name, category, description, price, original_price, ratings, image: image_filename, isAvailable});
        res.json({success: true, message: "Product Added Successfully", productId});
    
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const listProducts = async (req, res) => {
    try {
        const productList = await productServices.getAllProducts();        
        res.json({success: true, data: productList});
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const removeProduct = async (req, res) => {
    try {
        const productRemoved = await productServices.findProductById(req.body.id);
        if (!productRemoved) {
            return res.json({ success: false, error: "Product not found" });
        }

        const imagePath = path.join(process.cwd(), "uploads", productRemoved.image);
        if (fs.existsSync(imagePath)) 
        {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error Deleting File: ", err);
            });
        } 
        else 
        {
            return res.json({ success: false, error: "Image File Not Found" });
        }

        await productServices.findProductByIdAndDelete(req.body.id);
        res.json({success:true, message: "Product Removed Successfully"})

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const editProduct = async (req, res) => {
    try {

        const parsedBody = {
            id: req.body.id ? Number(req.body.id) : 0,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            ratings: req.body.ratings ? Number(req.body.ratings) : 0,
            price: req.body.price ? Number(req.body.price) : 0,
            original_price: req.body.original_price ? Number(req.body.original_price) : 0,
            isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
        };

        const {data, error} = editProductValidatorSchema.safeParse(parsedBody);

        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const {id, name, category, description, price, original_price, ratings, isAvailable} = data;

        const oldProduct = await productServices.findProductById(id);
        if(!oldProduct)
            return res.json({success: false, error: "Product Not Found"});

        const image_filename = req.file ? `${req.file.filename}` : req.body.image;
        
        const productId = await productServices.findProductByIdAndUpdate({id, name, category, description, price, original_price, image: image_filename, ratings, isAvailable});
        return res.json({success: true, message: "Product Updated Successfully", productId});
    
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error: error.message });
    }
}
