const orderButton = document.getElementById("order-button");
const cartBody = document.getElementById("cart-body");
const notification = document.getElementById("notification");
let currentCartId = "";


async function orderCart() {
	cartBody.innerHTML = "";
	let fetchOptions = {
		method: "PUT",
		headers: {'Content-Type': 'application/json'},
	}
	let res = await fetch(`/api/cart/order/${currentCartId}`, fetchOptions)
	let  data = await res.json();
	console.log(data)
	if(data.success) {
		showOrderedNotification();
	}
}

async function showOrderedNotification() {
	notification.style.display = "block";
}

async function getCartProducts() {
	let fetchOptions = {
		method: "GET",
		headers: {'Content-Type': 'application/json'},
	}
	let res = await fetch(`/api/cart/${currentCartId}/products`, fetchOptions)
	let  data = await res.json();
	console.log(data)
	if(data.success) {
		return data.response.products;
	}
	return [];
}

async function getCart() {
	let fetchOptions = {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
	}
	let res = await fetch("/api/cart", fetchOptions)
	let  data = await res.json();
	if(data.success) {
		currentCartId = data.response.cartId;
	}
}

async function logoff() {
	let fetchOptions = {
		method: "GET",
		headers: {'Content-Type': 'application/json'},
	}
	const res = await fetch("/api/auth/logoff", fetchOptions)
	let data = await res.json();
	if(data.success) {
		window.location.href = "/site/login";
	}
}

async function init() {
	await getCart();
	const products = await getCartProducts();
	products.forEach(product => {
		let row = document.createElement("tr");
		row.innerHTML =
		`
			<td>${product.name}</td>
			<td>${product.code}</td>
			<td style="text-align:center;">$${product.price}</td>
		`;
		cartBody.append(row);
	})
}
init();

