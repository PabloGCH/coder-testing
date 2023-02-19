import assert from "assert";
import axios from "axios";

const BACKURL = "http://localhost:8080/api";
const axiosInstance = axios.create({
    baseURL: BACKURL,
});

async function logIn() {
	let logData = {
		username: "asd",
		password: "123",
	};
    let response = await axiosInstance.post(`${BACKURL}/auth/login`, logData);
    const cookie = response.headers["set-cookie"][0];
    axiosInstance.defaults.headers.Cookie = cookie;
    return;
}

let id = -1;
describe("LOGIN TEST", () => {
    it("USER WAS LOGGED", (done) => {
        logIn().then(() => {
            assert.ok(axiosInstance.defaults.headers.Cookie);
            done();
        });
    });
});
describe("GET PRODUCTS", () => {
    let response;
    it("GET PRODUCTS", (done) => {
        axiosInstance.get(`${BACKURL}/products/products`)
        .then((res) => {
            response = res;
            assert.ok(response.data.products);
            done();
        })
    })
});
describe("ADD PRODUCT", () => {
    let newProduct = {
        name: "new product",
        price: 400,
        imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
    };
    let response;
    it("REQUEST WAS SUCCESFUL", (done) => {
        axiosInstance.post(`${BACKURL}/products/product`, newProduct)
        .then((res) => {
            response = res;
            assert.ok(response && response.data && response.data.success);
            id = (response.data.newProduct._id || response.data.newProduct.id) || -1;
            done();
        })
    });
    it("PRODUCT WAS ADDED", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct._id);
    });
    it("PRODUCT WAS ADDED WITH PROPER NAME", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.name === newProduct.name);
    });
    it("PRODUCT WAS ADDED WITH PROPER PRICE", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.price === newProduct.price);
    });
    it("PRODUCT WAS ADDED WITH PROPER IMGURL", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.imgUrl === newProduct.imgUrl);
    });
});

describe("UPDATE PRODUCT", () => {
    let newProduct = {
        name: "new name product",
        price: 150,
        imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
    };
    let response;
    it("REQUEST WAS SUCCESFUL", (done) => {
        axiosInstance.put(`${BACKURL}/products/product/${id}`, newProduct)
            .then((res) => {
                response = res;
                assert.ok(response && response.data && response.data.success);
                id = (response.data.newProduct._id || response.data.newProduct.id) || -1;
                done();
            })
    });
    it("PRODUCT WAS UPDATED WITH PROPER NAME", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.name === newProduct.name);
    });
    it("PRODUCT WAS UPDATED WITH PROPER PRICE", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.price === newProduct.price);
    });
    it("PRODUCT WAS UPDATED WITH PROPER IMGURL", () => {
        assert.ok(response.data && response.data.newProduct && response.data.newProduct.imgUrl === newProduct.imgUrl);
    });
});

describe("DELETE PRODUCT", () => {
    it("REQUEST WAS SUCCESFUL", (done) => {
        axiosInstance.delete(`${BACKURL}/products/product/${id}`)
        .then((res) => {
            assert.ok(res && res.data && res.data.success);
            done();
        });
    });
});







