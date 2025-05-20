import ApiError from "../api-error.js";
import CustomersService from "../services/customers.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    if(!sharedController.isValid(req.body, ['name', 'address'])) {
        return next(new ApiError(400, "Invalid customer data!"));
    }
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const customersService = new CustomersService();
            return await customersService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the customer: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const customersService = new CustomersService();
                if(req.params) {
                    return await customersService.query(req.params, conn);
                } else {
                    return await customersService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the customer: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const customersService = new CustomersService();
                return await customersService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the customer: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const customersService = new CustomersService();
            return await customersService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the customer: ${error}`)
        )
    }
}