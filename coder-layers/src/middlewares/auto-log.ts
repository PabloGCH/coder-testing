import express from "express";
import { UserModel } from "../models/user-model-mongo";

const autoLog = async (req :express.Request|any ,res :express.Response, next:express.NextFunction) =>{
	try {
		let user = req.session.user;
		let dbUser = await UserModel.findById(user.id);
		if(user && dbUser && user.id == dbUser._id.toString()) {
			res.redirect("/site/home");
		}
		throw "";
	} catch(err) {
		next();
	}

}

export default autoLog;
