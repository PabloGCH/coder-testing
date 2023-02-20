import fs from "fs";

//models
import Response from "../../models/response";
import Cart from "../../models/cart";
import CartFile from "../../models/cart-file";
import ProductManager from "../products/product-fs";
import Product from "../../models/product";

class CartManager {
	private fileDir :string;
	private productManager :ProductManager;

	constructor(cartFileDir :string, productFileDir :string) {
		this.productManager = new ProductManager(productFileDir);
		this.fileDir = cartFileDir;
	}

	private async readFile() :Promise<Response>{
		try {
			return {response: JSON.parse(await fs.promises.readFile(this.fileDir, "utf-8")), success: true};
		}
		catch(err) {
			return {response: "failed to read cart file", success: false}

		}
	}
	private async writeFile(file :CartFile) :Promise<Response> {
		try {
			await fs.promises.writeFile(this.fileDir, JSON.stringify(file, null, "	"));
			return {response: "succesfully wrote file", success: true};
		}
		catch {
			return {response: "failed to write file", success: false}
		}
	}
	public async createCart() :Promise<Response>{
		try {
			let fileread = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :CartFile = fileread.response;
			file.lastId++;
			let newCart :Cart = {
				id: file.lastId,
				timestamp: Date.now().toString(),
				products: []
			};
			console.log(file);
			file.carts.push(newCart);
			let filewrite = await this.writeFile(file);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: {message: "cart succesfully created", cartId: newCart.id}, success: true};
		}
		catch(err) {
			return {response: err, success: false}
		}
	}
	public async getProductsById(id :number|string) :Promise<Response>{
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :CartFile = fileread.response;
			let cart:Cart|undefined = file.carts.find(cart => cart.id == id);
			if(!cart) {
				throw "the cart does not exist in file";
			}
			return {response: {message: "products retrieved",  products:cart.products}, success: true};
		}
		catch(err) {
			return {response: err, success: false};
		}
	}

	public async deleteById(id:number|string) :Promise<Response>{
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :CartFile = fileread.response;
			let index = file.carts.findIndex((cart :Cart) => cart.id == id);
			if(index == -1 || typeof(index) != "number") {
				throw "the cart doesn't exist";
			}
			file.carts.splice(index, 1)
			let filewrite :Response = await this.writeFile(file);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: "cart succesfully deleted", success: false};
		}
		catch(err) {
			return {response: err, success: false};
		}
	}

	public async addProduct(cartId :number|string, productId :number|string) :Promise<Response> {
		try {
			let cartfileread :Response = await this.readFile();
			if(!cartfileread.success) {
				throw cartfileread.response;
			}
			let cartfile :CartFile = cartfileread.response;


			let getproduct :Response = await this.productManager.getProductById(productId);
			if(!getproduct.success) {
				throw getproduct.response;
			}
			let product = getproduct.response.product;


			let index = cartfile.carts.findIndex((cart :Cart) => cart.id == cartId);
			if(index == -1 || typeof(index) != "number") {
				throw "the cart doesn't exist";
			}

			cartfile.carts[index].products?.push(product);
			
			let filewrite = await this.writeFile(cartfile);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: "product added to cart with success", success: true};
		} 
		catch(err) {
			return {response: err, success: false};;
		}
	}


	public async removeProduct(cartId :number|string, productId :number|string) :Promise<Response> {
		try {
			let cartfileread :Response = await this.readFile();
			if(!cartfileread.success) {
				throw cartfileread.response;
			}
			let cartfile :CartFile = cartfileread.response;

			let cartIndex = cartfile.carts.findIndex((cart :Cart) => cart.id == cartId);
			if(cartIndex == -1 || typeof(cartIndex) != "number") {
				throw "the cart doesn't exist";
			}
			let productIndex = cartfile.carts[cartIndex].products?.findIndex((product:Product) => product.id == productId);
			if(productIndex == -1 || typeof(productIndex) != "number") {
				throw "there is no product in the cart with the submitted id";
			}

			cartfile.carts[cartIndex].products?.splice(productIndex, 1);
			
			let filewrite = await this.writeFile(cartfile);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: "product removed from cart with success", success: true};
		} 
		catch(err) {
			return {response: err, success: false};;
		}
	}
}

export default CartManager;
