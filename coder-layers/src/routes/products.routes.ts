import express from "express";
//import ProductManager from "../daos/products/product-fs";

import isAuthenticated from "../middlewares/is-authenticated";
import { addProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller";

//const PRODUCTFILEDIR = path.join(__dirname, "../assets/products.json");
//const productManager :ProductManager = new ProductManager(PRODUCTFILEDIR);
const productsRouter = express.Router();

productsRouter.get("/", getProducts)

productsRouter.get("/:id", getProduct)

productsRouter.post("/", isAuthenticated, addProduct)

productsRouter.put("/:id", isAuthenticated, updateProduct)

productsRouter.delete("/:id", isAuthenticated, )


export default productsRouter;
