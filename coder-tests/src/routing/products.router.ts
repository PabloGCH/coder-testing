import express from "express";
import { newProduct } from "../controllers/products.controller";
const router = express.Router();
router.post("/product", newProduct);
export {router as productsRouter};
