//GET HTML ELEMENTS
const getProductResponse = document.getElementById("get-response");
const addProductBody = document.getElementById("add-body");
const addProductResponse = document.getElementById("add-response");
const updateProductBody = document.getElementById("update-body");
const updateProductResponse = document.getElementById("update-response");
const removeProductBody = document.getElementById("remove-body");
const removeProductResponse = document.getElementById("remove-response");

const BACKURL = "http://localhost:8080/api";

//GET PRODUCTS
async function getProducts() {
    try {
        const response = await axios.get(`${BACKURL}/products/products`)
        getProductResponse.innerHTML = JSON.stringify(response.data, null, 10);
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}
async function addProduct() {
    try {
        let id = -1;
        return id;
    }
    catch (error) {
        console.log(error);
    }
}
async function updateProduct(id) {
    try {

    } catch (error) {
        console.log(error);
    }
}
async function removeProduct(id) {
    try {

    } catch (error) {
        console.log(error);
    }
}

async function test() {
    await getProducts();
    let newProductId = await addProduct() || -1;
    await updateProduct(newProductId);
    await removeProduct(newProductId);
}

test();


