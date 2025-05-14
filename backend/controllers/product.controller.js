import ApiError from "../api-error.js";
import ProductService from "../services/product.service.js";

function isValid(payload, requiredFields = ['name', 'manufacturer', 'salePrice']) {
    return requiredFields.every(field => payload[field]);
}

export async function insert(req, res, next) {
    if(!isValid(req.body)) {
        return next(new ApiError(400, "Invalid product data!"));
    }

    try {
        const productService = new ProductService();
        const result = await productService.insert(req.body);
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
        const productService = new ProductService();
        result = await productService.query(req.query);
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while quering the product: ${error}`)
        );
    }
}