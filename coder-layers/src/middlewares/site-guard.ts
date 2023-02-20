import express from "express";
import { UserModel } from "../models/user-model-mongo";

const siteGuard = async (req :express.Request|any ,res :express.Response, next:express.NextFunction) =>{
	try {
		let user = req.session.user;
		let dbUser = await UserModel.findById(user.id);
		if(!user) {throw ""}
		if(!dbUser) {throw ""}
		if(user.id != dbUser._id.toString()) {throw ""}
		next();
	} catch(err) {
		res.redirect("/site/login");
	}

}

export default siteGuard;
