import ApiError from "../api-error.js";
import PositionsService from "../services/positions.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    if(!sharedController.isValid(req.body, ['name', 'level'])) {
        return next(new ApiError(400, "Invalid position data!"));
    }
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const positionService = new PositionsService();
            return await positionService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the position: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const positionService = new PositionsService();
                if(req.params) {
                    return await positionService.query(req.params, conn);
                } else {
                    return await positionService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while quering the position: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const positionService = new PositionsService();
                return await positionService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the position: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const positionService = new PositionsService();
            return await positionService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the position: ${error}`)
        )
    }
}