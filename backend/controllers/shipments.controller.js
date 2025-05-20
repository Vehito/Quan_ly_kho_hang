import ApiError from "../api-error.js";
import ShipmentsService from "../services/shipments.service.js";
import * as sharedController from "./controller.shared.js";

function getObject(isImport) {
    return isImport ? "supplier_id" : "customer_id";
}

function checkValidType(isImport) {
    if(typeof isImport === "boolean") {
        return;
    }
    throw Error("Invalid sihpment data!");
}

export async function insert(req, res, next) {
    try {
    checkValidType(req.body.isImport);
    const object = getObject(req.body.isImport);
    if(!sharedController.isValid(req.body, [object, 'created_by'])) {
        return next(new ApiError(400, "Invalid shipment data!"));
    }
        const result = await sharedController
        .withTransaction(async (conn) => {
            const shipmentService = new ShipmentsService(req.body.isImport);
            return await shipmentService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the shipment: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentService = new ShipmentsService(req.body.isImport);
                if(req.params) {
                    return await shipmentService.query(req.params, conn);
                } else {
                    return await shipmentService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the shipment: ${error}`)
        );
    }
}

// export async function update(req, res, next) {
//     let result = [];
//     try {
//         result = await sharedController
//             .withTransaction(async (conn) => {
//                 const shipmentService = new ShipmentsService();
//                 return await shipmentService.update(req.params.id, req.body, conn);
//             });
//         return res.send(result);
//     } catch (error) {
//         return next(
//             new ApiError(500, `An error occured while updating the shipment: ${error}`)
//         );
//     }
// }

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const shipmentService = new ShipmentsService(req.body.isImport);
            return await shipmentService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the shipment: ${error}`)
        )
    }
}