import twilio from "twilio";
import nodemailer from "nodemailer";

export const mailClient = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: process.env.ADMIN_MAIL,
		pass: process.env.ADMIN_PASSWORD
	},
	secure: false,
	tls: {
		rejectUnauthorized: false
	}
})

export const smsClient = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN)


