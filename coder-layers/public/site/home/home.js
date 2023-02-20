const notification = document.getElementById("notification");
const productContainer = document.getElementById("product-container");
let currentCartId = "";

async function showAddedNotification() {
	notification.style.display = "block";
	setTimeout(() => {
		notification.style.display = "none";
	}, 1500)
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

async function addToCart(productId) {
	if(!currentCartId) { await getCart()}
	let fetchOptions = {
		method: "POST",
		headers: {'Content-Type': 'application/json'}
	}
	const res = await fetch(`/api/cart/${currentCartId}/products/${productId}`, fetchOptions)
	let data = await res.json();
	if(data.success) {
		showAddedNotification();
	}
}	

async function getProducts() {
	let fetchOptions = {
		method: "GET",
		headers: {'Content-Type': 'application/json'},
	}
	const res = await fetch("/api/products", fetchOptions)
	let data = await res.json();
	if(data.success) {
		productContainer.innerHTML = "";
		const products = data.response.products;
		products.forEach(product => {
			let productBox = document.createElement("div");
			productBox.className = "product-box";
			productBox.innerHTML =
				`
					<img src="${product.imgUrl}">
					<div>
						<span class="title">${product.name}</span>
						<span class="price">$${product.price}</span>
					</div>
					<span class="code">${product.code}</span>
					<button onclick="addToCart('${product._id}')">Add to cart</button>
				`
			productContainer.append(productBox);
		})
	}
}

getProducts();


