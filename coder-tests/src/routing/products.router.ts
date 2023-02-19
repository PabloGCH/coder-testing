import express from "express";
import { getProducts, newProduct } from "../controllers/products.controller";
const router = express.Router();
router.post("/product", newProduct);
router.get("/products", getProducts);
export {router as productsRouter};
