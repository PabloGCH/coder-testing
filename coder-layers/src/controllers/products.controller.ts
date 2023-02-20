import ProductManager from "../persistence/products/product-mongo"
import Response from "../models/response";
const productManager :ProductManager = new ProductManager();


export const getProducts = (req :any, res :any) => {
	productManager.getAll().then((result :Response) => {
		res.send(result);
	})
}

export const getProduct = (req :any, res :any) => {
	let {id} = req.params;
	productManager.getProductById(id).then((result :Response) => {
		res.send(result);
	})
}

export const addProduct =  (req :any, res :any) => {
	productManager.saveProduct(req.body).then((result :Response) => {
		res.send(result);
	})
}

export const updateProduct = (req :any, res :any) => {
	let {id} = req.params;
	productManager.edit(req.body, id).then((result :Response) => {
		res.send(result);
	})
}

export const deleteProduct = (req :any, res :any) => {
	let {id} = req.params;
	productManager.deleteById(id).then((result :Response) => {
		res.send(result);
	})
}
