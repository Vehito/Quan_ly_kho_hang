import ApiError from "../api-error.js";
import SuppliersService from "../services/suppliers.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    if(!sharedController.isValid(req.body, ['name', 'address', 'phone'])) {
        return next(new ApiError(400, "Invalid supplier data!"));
    }
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const supplierService = new SuppliersService();
            return await supplierService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the supplier: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const supplierService = new SuppliersService();
                if(req.params) {
                    return await supplierService.query(req.params, conn);
                } else {
                    return await supplierService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while quering the supplier: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const supplierService = new SuppliersService();
                return await supplierService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the supplier: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const supplierService = new SuppliersService();
            return await supplierService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the supplier: ${error}`)
        )
    }
}