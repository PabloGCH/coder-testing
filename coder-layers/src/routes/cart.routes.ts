import express from "express";
import isAuthenticated from "../middlewares/is-authenticated";
import { addProductToCart, deleteCart, getCart, getProductsById, orderCart } from "../controllers/carts.controller";

//const CARTFILEDIR = path.join(__dirname, "../assets/carts.json");
//const PRODUCTFILEDIR = path.join(__dirname, "../assets/products.json");

//const cartManager :CartManager = new CartManager(CARTFILEDIR, PRODUCTFILEDIR);

var cartRouter = express.Router();



//Consigue un carrito activo, si no existe lo crea
cartRouter.post("/", isAuthenticated, getCart);

cartRouter.put("/order/:id", isAuthenticated, orderCart)

cartRouter.delete("/:id", isAuthenticated, deleteCart);

cartRouter.get("/:id/products", isAuthenticated, getProductsById);

cartRouter.post("/:id/products/:id_prod", isAuthenticated, addProductToCart);

cartRouter.delete("/:id/products/:id_prod", isAuthenticated, );




export default cartRouter;
