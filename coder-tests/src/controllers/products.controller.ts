import { Request, Response } from 'express';
import { ProductDTO } from '../DTOs/product.dto';
import { Controller } from '../interfaces/controller.interface';
import { MANAGERTYPE } from '../persistence/enums/managerType.enum';
import { createManager } from '../persistence/managerFactory';
import { errorLogger } from '../services/logger.service';
import { SocketService } from '../services/socket.service';



export const newProduct :Controller =  async (req :Request|any, res :Response|any) => {
    try {
        const io = SocketService.getInstance().getSocketServer();
        const productManager = createManager(MANAGERTYPE.PRODUCTS); 
        if(productManager === null) {
            throw new Error("Failed to create product manager");
        }
        if(req.session.user == undefined){
            let error = {success: false, message: "not_logged"};
            errorLogger.error({
                message: "User not logged in",
                url: req.url,
                method: req.method
            })
            res.send(error)
        } else {
            let product = req.body;
            Object.assign(product, {price: parseInt(product.price)});
            productManager.save(product).then(() => {
                productManager.getObjects().then((products:any[]) => {
                    let productDTO :ProductDTO[] = products.map((product:any) => {return new ProductDTO(product)});
                    io.sockets.emit("products", {products: productDTO})
                    res.send({success: true})
                })
            })
            .catch(err => {
                errorLogger.error({
                    message: "Failed to add product",
                    error: err,
                    url: req.url,
                    method: req.method
                });
                res.send({success: false, message: err || "Failed to add product"})
            })
        }
    }
    catch(err) {
        errorLogger.error({
            message: "Failed to add product",
            error: err,
            url: req.url,
            method: req.method
        });
        res.send({success: false, message: err || "Failed to add product"})
    }
}
