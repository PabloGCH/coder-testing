import mongoose from "mongoose";

//models
import Response from "../../models/response";
import Cart from "../../models/cart";
import { cartModel } from "../../models/cart-model-mongo";
import { productModel } from "../../models/product-model-mongo";
import { config } from "../../config/config";
import CART_STATUS from "../../enums/cartStatus";
import { mailClient, smsClient } from "../../mailer/mailer";
import { errorLogger } from "../../logger/logger";




class CartManager {
	constructor() {

	}

	public async getCart(userId :string) :Promise<Response>{
		try {
			let activeCart = await cartModel.findOne({userId: userId, status: CART_STATUS.ACTIVE});
			if(activeCart) {
				return {response: {message: "There is already an active cart for this user", cartId: activeCart._id}, success: true};
			} else {
				let cart:Cart = {
					products: [],
					userId: userId,
					status: CART_STATUS.ACTIVE
				};
				let newCart = await cartModel.create(cart)
				return {response: {message: "Cart succesfully created", cartId: newCart._id}, success: true};
			}
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to get a cart",
				error: err
			})
			return {response: err, success: false}
		}
	}
	public async getProductsById(cartId :number|string) :Promise<Response>{
		try {
			let cart = await cartModel.findById(cartId);
			if(!cart) {
				throw "Cart does not exist";
			}
			let productsFromDb = await productModel.find({_id: { $in: cart?.products}})
			const products :any[] = [];
			cart?.products.forEach(el => {
				let product = productsFromDb.find(p => p._id.toString() == el);
				if(product) products.push(product);
			})

			return {response: {message: "products retrieved",  products: products}, success: true};
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to get a cart's products",
				error: err
			})
			return {response: err, success: false};
		}
	}

	public async deleteById(id:number|string) :Promise<Response>{
		try {
			let cart = await cartModel.findByIdAndDelete(id);
			return {response: "cart succesfully deleted", success: true};
		}
		catch(err) {
			return {response: err, success: false};
		}
	}

	public async addProduct(cartId :number|string, productId :number|string) :Promise<Response> {
		try {
			let cart = await cartModel.findByIdAndUpdate(cartId, {$push: {products: productId}})
			return {response: "product added to cart with success", success: true};
		} 
		catch(err) {
			errorLogger.error({
				message: "Failed to add product to cart",
				error: err
			})
			return {response: err, success: false};;
		}
	}


	public async removeProduct(cartId :number|string, productId :number|string) :Promise<Response> {
		try {
			let cart = await cartModel.findByIdAndUpdate(cartId, {$pull: {products: {$eq: productId}}})
			return {response: "product removed from cart with success", success: true};
		} 
		catch(err) {
			errorLogger.error({
				message: "Failed to remove product from cart",
				error: err
			})
			return {response: err, success: false};;
		}
	}

	public async orderCart(cartId :number|string, username :string, userphone :string) :Promise<Response> {
		try {
			let cart = await cartModel.findById(cartId);
			if(!cart) {
				throw "Cart does not exist";
			}
			if(cart.status != CART_STATUS.ACTIVE) {
				throw "Can't order a closed or pending cart";
			} 
			if(cart.products.length == 0) {
				throw "Can't order a empty cart";
			}

			const cartOrder = await cartModel.findByIdAndUpdate(cart._id, {status: CART_STATUS.PENDING});
			let productsFromDb = await productModel.find({_id: { $in: cartOrder?.products}})
			const products :any[] = [];
			cartOrder?.products.forEach(el => {
				let product = productsFromDb.find(p => p._id.toString() == el);
				if(product) products.push(product);
			})

			let productsStr = "";
			products.forEach(el => {
				productsStr += `<li><span style="color: orange;font-weight:bold;">${el._id}</span> ${el.name} <span style="font-weight:bold; color: green;">$${el.price}</span></li>`
			})
			mailClient.sendMail({
				from: "server",
				to: process.env.ADMIN_MAIL,
				subject: `NEW ORDER FROM ${username}`,
				html: `
				<div>
				<h1>NEW ORDER FROM ${username}</h1>
				<h2>Products: </h2>
				<ul>
					${productsStr}
				</ul>
				</div>
				`
			});
			await smsClient.messages.create({
				body: "Your order is being processed",
				from: process.env.SERVER_PHONE,
				to:  userphone || ""
			})
			await smsClient.messages.create({
				body: `NEW ORDER FROM ${username}`,
				from: process.env.SERVER_WSP_PHONE || "",
				to:  "whatsapp:" + process.env.ADMIN_PHONE || ""
			})
			return {response: "Cart order sent", success: true};;
		}
		catch(err) {
			errorLogger.error({
				message: "Failed to sent order from cart",
				error: err
			})
			return {response: err, success: false};;
		}
	}
}

export default CartManager;
