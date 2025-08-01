import ApiError from "../api-error.js";
import PositionsService from "../services/departments.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['name', 'level'], 'department');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const departmentService = new PositionsService();
            return await departmentService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the department: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const departmentService = new PositionsService();
                if(req.params) {
                    return await departmentService.query(req.params, conn);
                } else {
                    return await departmentService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the department: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const departmentService = new PositionsService();
                return await departmentService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the department: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const departmentService = new PositionsService();
            return await departmentService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the department: ${error}`)
        )
    }
}