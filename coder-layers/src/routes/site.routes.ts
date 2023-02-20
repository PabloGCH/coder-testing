import express from "express";
import path from "path";
import autoLog from "../middlewares/auto-log";
import siteGuard from "../middlewares/site-guard";

const siteRouter = express.Router();


siteRouter.get("/home", siteGuard, (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/site/home', 'home.html'))
})

siteRouter.get("/login", autoLog,(req, res) => {
	res.sendFile(path.join(__dirname, '../../public/site/login', 'login.html'))
})

siteRouter.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/site/register', 'register.html'))
})

siteRouter.get("/cart",  siteGuard, (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/site/cart', 'cart.html'))
})



export default siteRouter;
