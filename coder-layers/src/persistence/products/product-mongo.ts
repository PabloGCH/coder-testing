import { error } from "console";
import mongoose from "mongoose";
import { productModel } from "../../models/product-model-mongo";
import { config } from "../../config/config";

//models
import Response from "../../models/response";
import Product from "../../models/product";
import { errorLogger } from "../../logger/logger";

class ProductManager {
	constructor() {

	}

	public async saveProduct(product :Product) :Promise<Response>{
		try {
			let errors :any[] = [];
			let newProduct = await productModel.create(product)
			return {response: {message: "product succesfully added", product: newProduct}, success: true};
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to add product",
				error: err
			})
			return {response: err, success: false}
		}
	}
	public async getProductById(id :number|string) :Promise<Response>{
		try {
			let product = await productModel.findById(id);
			return {response: {message: "product retrieved",  product:product}, success: true};
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to get product",
				error: err
			})
			return {response: err, success: false};
		}
	}
	public async getAll() :Promise<Response> {
		try {
			let products = await productModel.find({});
			return {response: {message: "products retrieved", products: products}, success: true};
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to get products",
				error: err
			})
			return {response:err, success: false};
		}
	}
	public async deleteById(id:number|string) :Promise<Response>{
		try {
			let product = await productModel.findByIdAndDelete(id);
			return {response: "product succesfully deleted", success: false};
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to delete product",
				error: err
			})
			return {response: err, success: false};
		}
	}
	public async edit(product:Product, id:number|string) :Promise<Response> {
		try {
			let newProduct = await productModel.findByIdAndUpdate(id, product, {new: true});
			return {response: {message: "product edited with success", product: newProduct}, success: true};
		} 
		catch(err) {
			errorLogger.error({
				message: "Failed to edit product",
				error: err
			})
			return {response: err, success: false};;
		}
	}
}

export default ProductManager;
