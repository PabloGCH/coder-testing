//Dependencies
import cluster from "cluster";
import os from "os";
import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

//Route imports
//==========================================================
import productsRouter from "./routes/products.routes";
import cartRouter from "./routes/cart.routes";
import siteRouter from "./routes/site.routes";
import path from "path";

//Interfaces
//==========================================================
import { UserModel } from "./models/user-model-mongo";
import authRouter from "./routes/auth.routes";

//Config import
//==========================================================
import { config } from "./config/config";
import { errorLogger, infoLogger, warningLogger } from "./logger/logger";



//Init variables
//==========================================================
const app = express();
const NUMBEROFCORES = os.cpus().length;

//Tools
//==========================================================
//Native config
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../public')));
//Passport config
app.use(session({
	store: MongoStore.create({mongoUrl: config.mongo.ulr}),
	secret: "dfvartg4wfqR3EFRQ3",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 10 // 1 segundo * 60 * 10 = 10 minutos
	}
}))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user :any,done)=>{
	done(null,user.id);
})
passport.deserializeUser((id, done)=>{
	UserModel.findById(id, (err:any, userFound :any) => {
		if(err) return done(err);
		return done(null, userFound);
	})
})

//Sub routers
//==========================================================
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/site", siteRouter);
app.get("/", (req, res) => {
	res.redirect("/site/home");
})

mongoose.connect(config.mongo.ulr||"").then(
	() => {
		infoLogger.info("DB connection successful")
	},
	err => {
		errorLogger.error({
			message: "DB connection failed",
			error: err
		})
	}
)

if(process.env.MODE == "CLUSTER" && cluster.isPrimary) {
	infoLogger.info("Server initialized on cluster mode")
	for(let i = 0; i < NUMBEROFCORES; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, error) => {
		warningLogger.warn({
			message: `Subproccess with id ${worker.id} died and had to be run again`,
			error: error
		})
		cluster.fork();
	})
} else {
	if(process.env.MODE == "FORK") {infoLogger.info("Server initialized on fork mode")}
	app.listen(process.env.PORT, () => {
		if(process.env.MODE == "CLUSTER") {infoLogger.info("New server initialized on port " + process.env.PORT)}
		if(process.env.MODE == "FORK") {infoLogger.info("Server listening on port " + process.env.PORT)}
	});
}




