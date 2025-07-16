import ApiError from "../api-error.js";
import ProductService from "../services/products.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['name', 'manufacturer', 'sale_price'], 'product');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const productService = new ProductService();
            return await productService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the product: ${error}`)
        );
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const productService = new ProductService();
                if(req.params?.id) {
                    return await productService.query(req.params, conn);
                } else if(req.query?.itemLength) {
                    return await productService.queryCount(req.query, conn);
                } else {
                    return await productService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the product: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const productService = new ProductService();
                return await productService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the product: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const productService = new ProductService();
            return await productService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the product: ${error}`)
        )
    }
}