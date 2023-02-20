import Product from "./product";

interface Cart {
	id ?:number,
	timestamp?:string,
	userId:string,
	status:number,
	products ?:Product[]
}

export default Cart;
