const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const failMessage = document.getElementById("fail-message");


async function login() {
	let body = {
		password: passwordInput.value,
		email: emailInput.value
	}
	let fetchOptions = {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(body)
	}
	const res = await fetch("/api/auth/login", fetchOptions);
	const data = await res.json();
	if(data.success) {
		window.location.href = "/site/home";
	} else {
		failMessage.style.display = "block"
	}
}
