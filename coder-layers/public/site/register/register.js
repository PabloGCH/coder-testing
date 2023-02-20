const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const phoneInput = document.getElementById("phone");
const avatarInput = document.getElementById("avatar");
const nameInput = document.getElementById("name");
const addressInput = document.getElementById("address");



async function register() {
	let body = {
		password: passwordInput.value,
		email: emailInput.value,
		username: nameInput.value,
		phone: phoneInput.value,
		avatar: avatarInput.value,
		address: addressInput.value
	}
	let fetchOptions = {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(body)
	}
	const res = await fetch("/api/auth/register", fetchOptions);
	const data = await res.json();
	if(data.success) {
		window.location.href = "/site/home";
	}
}
