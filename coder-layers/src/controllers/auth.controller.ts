import { UserModel } from "../models/user-model-mongo";
import bcrypt from "bcrypt";
import { errorLogger } from "../logger/logger";
import { mailClient } from "../mailer/mailer";

export const login =  (req:any, res:any) => {
    try {
        const body = req.body;
        if(req.session.user) {
            res.send({message:"already logged"})
        } else if(body.email && body.password) {
            UserModel.findOne({email: body.email}, (err:any, userFound:any) => {
                if(err) {
                    res.send(err)
                }
                if(userFound) {
                    if(bcrypt.compareSync(body.password, userFound.password)) {
                        req.session.user = {
                            id: userFound._id,
                            username: userFound.username,
                            password: userFound.password,
                            phone: userFound.phone,
                            email: userFound.email,
                        }
                        res.send({success: true, message: "Session initialized"})
                    } else {
                        res.send({success: false, message: "Invalid password"})
                    }
                } else {
                    res.send({success: false, message: "The user does not exist"})
                }
            })

        } else {
            res.send({success: false, message: "Invalid user inputs"})
        }
    }
    catch(err) {
        errorLogger.error({
            message: "Failed to login user",
            error: err
        })
        res.send({success: false, message: "Failed to login user"})
    }

}



export const register = async (req:any,res:any) => {
	try {
		if(req.success) {
			mailClient.sendMail({
				from: "server",
				to: process.env.ADMIN_MAIL,
				subject: "NEW USER",
				html: `
				<div>
				<h1>New user has registered</h1>
				<h2>User data: </h2>
				<p>Id: <span>${req.user._id}</span></p>
				<p>Name: <span>${req.user.username}</span></p>
				<p>Email: <span>${req.user.email}</span></p>
				<p>Address: <span>${req.user.address}</span></p>
				<p>Phone: <span>${req.user.phone}</span></p>
				</div>
				`
			});
		}
		res.send({success: req.success || false, message: req.message||""})
	} catch(err) {
		errorLogger.error({
			message: "Failed to email admin about user registering",
			error: err
		})
		res.send({success: false, message: err})
	}
}

export const logoff = (req :any, res :any) => {
	try {
		req.logout((err :any) => {
			if(err) {
				errorLogger.error({
					message: "Failed to close user session"
				})
				return res.send({success: false, message:"Failed to close session"})
			}
			else {
				req.session.destroy(() => {
					res.send({success: true, message: "Logged off successfully"})
				});
			}
		})
	}
	catch(err) {
		errorLogger.error({
			message: "Failed to close user session"
		})
		res.send({success: false, message: "Failed to log off"})
	}
}
