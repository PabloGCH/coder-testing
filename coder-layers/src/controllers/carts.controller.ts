import Response from "../models/response";
import CartManager from "../persistence/carts/cart-mongo";
const cartManager :CartManager = new CartManager();


export const getCart =  (req:any, res:any) => {
	const userId = req.session.user.id;
	cartManager.getCart(userId).then((result :Response) => {
		res.send(result);
	})
}
export const orderCart = (req:any, res :any) => {
	let {id} = req.params;
	let user = req.session.user
	cartManager.orderCart(id, user.username, user.phone).then((result :Response) => {
		res.send(result);
	})
}

export const deleteCart = (req :any, res :any) => {
	let {id} = req.params;
	cartManager.deleteById(id).then((result :Response) => {
		res.send(result);
	})
}

export const getProductsById = (req :any, res:any) => {
	let {id} = req.params;
	cartManager.getProductsById(id).then((result :Response) => {
		res.send(result);
	})
}

export const addProductToCart = (req :any, res :any) => {
	let {id, id_prod} = req.params;
	cartManager.addProduct(id, id_prod).then((result :Response) => {
		res.send(result);
	})
}

export const removeProductFromCart = (req :any, res :any) => {
	let {id, id_prod} = req.params;
	cartManager.removeProduct(id, id_prod).then((result :Response) => {
		res.send(result);
	})
}
