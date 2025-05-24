import ApiError from "../api-error.js";
import ImportItemsService from "../services/import_items.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    sharedController.isValid(
        req.body, 
        ['shipment_id', 'product_id', 'mfg', 'exp', 'quantity', 'price'],
        
    )

    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const importItemService = new ImportItemsService();
            return await importItemService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the import item: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const importItemService = new ImportItemsService();
                if(req.params) {
                    return await importItemService.query(req.params, conn);
                } else {
                    return await importItemService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the import item: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const importItemService = new ImportItemsService();
                return await importItemService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the import item: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const importItemService = new ImportItemsService();
            return await importItemService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the import item: ${error}`)
        )
    }
}