import mongoose from "mongoose";
const productCollection = "products";
const productSchema = new mongoose.Schema({
	name: {type: String, required: true, max:100},
	description: {type: String, required: true, max:300},
	code: {type: String, required: true, max:300},
	imgUrl: {type: String, max:400},
	stock: {type: Number, required: true},
	price: {type: Number, required: true},
}, {timestamps: true});
export const productModel = mongoose.model(productCollection, productSchema);

