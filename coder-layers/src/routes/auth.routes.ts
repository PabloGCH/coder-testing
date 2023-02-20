import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user-model-mongo";
import { userInfo } from "os";
import User from "../models/user";
import { config } from "dotenv";
import { errorLogger } from "../logger/logger";
import { login, logoff, register } from "../controllers/auth.controller";


const authRouter = express.Router();

const createHash = (password :string) => {
	const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	return hash;
}

passport.use("signupStrategy", new passportLocal.Strategy(
	{
		passReqToCallback: true,
	},
	(req, username, password, done) => {
		try {
			UserModel.findOne({username: username}, (err:any, userFound:any) => {
				if(err) return done(err);
				if(userFound) {
					Object.assign(req, {success: false,message: "user already exists"})
					return done(null, userFound);
				}
				const newUser :User = req.body;
				newUser.password = createHash(newUser.password)
				UserModel.create(newUser, (err, userCreated) => {
					if(err) return done(err, userCreated, {message: "failed to register user"});
					Object.assign(req, {success: true, user: userCreated ,message: "User created"})
					return done(null, userCreated)
				})
			})
		} catch(err) {
			errorLogger.error({
				message: "Failed to register user",
				error: err
			})
		}
	}
));

authRouter.get("/logoff", logoff);

authRouter.post("/register", passport.authenticate("signupStrategy", {
	failureRedirect: "/register",
	failureMessage: true
}), register);

authRouter.post("/login", login);

export default authRouter;
