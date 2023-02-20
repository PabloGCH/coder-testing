import mongoose from "mongoose";
const userCollection = "users";
const userSchema = new mongoose.Schema({
	username: {type: String, required: true, max:100},
	email: {type: String, required: true, max:100},
	avatar: {type: String, required: true,max:100},
	phone: {type: String, required: true,max:100},
	password: {type: String, required: true,max:100},
	address: {type: String, required: true,max:200}
}, {timestamps: true});
export const UserModel = mongoose.model(userCollection, userSchema);
