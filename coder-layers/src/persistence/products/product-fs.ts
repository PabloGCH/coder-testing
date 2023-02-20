import fs from "fs";

//models
import Response from "../../models/response";
import Product from "../../models/product";
import ProductFile from "../../models/product-file";


class ProductManager {
	private fileDir :string;
	constructor(fileDir :string) {
		this.fileDir = fileDir;
	}

	private async readFile() :Promise<Response>{
		try {
			return {response: JSON.parse(await fs.promises.readFile(this.fileDir, "utf-8")), success: true};
		}
		catch(err) {
			console.log(err)
			return {response: "failed to read product file", success: false}

		}
	}
	private async writeFile(file :ProductFile) :Promise<Response> {
		try {
			await fs.promises.writeFile(this.fileDir, JSON.stringify(file, null, "	"));
			return {response: "succesfully wrote file", success: true};
		}
		catch {
			return {response: "failed to write file", success: false}
		}
	}
	public async saveProduct(product :Product) :Promise<Response>{
		try {
			let errors :any[] = [];
			let fileread = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :ProductFile = fileread.response;
			file.lastId++;
			let newProduct :Product = {
				id: file.lastId
			};

			typeof(product.name) == "string" ? newProduct.name = product.name : errors.push("Name must be a string");
			typeof(product.price) == "number" ? newProduct.price = product.price : errors.push("Price must be a number");
			typeof(product.code) == "string" ? newProduct.code = product.code : errors.push("Code must be a string");
			if(errors.length > 0){throw errors}
			typeof(product.imgUrl) == "string" ? newProduct.imgUrl = product.imgUrl : newProduct.imgUrl = "";
			typeof(product.description) == "string" ? newProduct.description = product.description : newProduct.description = "";
			(typeof(product.stock) == "number" && product.stock > 0) ? newProduct.stock = product.stock : newProduct.stock = 0;
			newProduct.timestamp = Date.now().toString();


			file.products.push(newProduct);
			let filewrite = await this.writeFile(file);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: {message: "product succesfully added", product: newProduct}, success: true};
		}
		catch(err) {
			return {response: err, success: false}
		}
	}
	public async getProductById(id :number|string) :Promise<Response>{
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :ProductFile = fileread.response;
			let product :Product|undefined = file.products.find(product => product.id == id);
			if(!product) {
				throw "the product does not exist in file";
			}
			return {response: {message: "product retrieved",  product:product}, success: true};
		}
		catch(err) {
			return {response: err, success: false};
		}
	}
	public async getAll() :Promise<Response> {
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :ProductFile = fileread.response;
			return {response: {message: "products retrieved", products:file.products}, success: true};
		}
		catch(err) {
			return {response:err, success: false};
		}
	}
	public async deleteById(id:number|string) :Promise<Response>{
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :ProductFile = fileread.response;
			let index = file.products.findIndex(product => product.id == id);
			if(index == -1) {
				throw "the product doesn't exist";
			}
			file.products.splice(index, 1)
			let filewrite :Response = await this.writeFile(file);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: "product succesfully deleted", success: false};
		}
		catch(err) {
			return {response: err, success: false};
		}
	}
	public async edit(product:Product, id:number|string) :Promise<Response> {
		try {
			let fileread :Response = await this.readFile();
			if(!fileread.success) {
				throw fileread.response;
			}
			let file :ProductFile = fileread.response;
			let index = file.products.findIndex(product => product.id == id);
			if(index == -1) {
				throw "the product doesn't exist";
			}
			try {
				Object.assign(file.products[index], product);
			}
			catch {
				throw "failed to edit product";
			}
			let filewrite = await this.writeFile(file);
			if(!filewrite.success) {
				throw filewrite.response;
			}
			return {response: {message: "product edited with success", product: file.products[index]}, success: true};
		} 
		catch(err) {
			return {response: err, success: false};;
		}
	}
	/*
	//product container legacy code
	async deleteAll() {
		try {
			let file = {
				lastId: 0,
				products: []
			};
			this.writeFile(file);
		}
		catch {
			console.log("Failed to delete objects");
		}
	}
	async randomProduct() {
		try {
			let file = await this.readFile();
			console.log(Math.round(Math.random() * (file.products.length - 1)))
			let product = file.products[Math.round(Math.random() * (file.products.length - 1))];
			return product;
		}
		catch {
			console.log("failed to get product")
		}
	}
	*/
}

export default ProductManager;
