import ApiError from "../api-error.js";
import ShipmentsService from "../services/shipments.service.js";
import ImportItemsService from "../services/import_items.service.js";
import ExportItemsService from "../services/export_items.service.js";
import * as sharedController from "./controller.shared.js";

function getObject(isImport) {
    return isImport ? "supplier_id" : "customer_id";
}

function getShipmentItemService(isImport) {
    return isImport ? new ImportItemsService() : new ExportItemsService();
}

function checkValidShipmentItems(listItem = [], isImport) {
    const requiredFields = isImport ? 
        ['shipment_id', 'product_id', 'mfg', 'exp', 'quantity', 'price'] : 
        ['shipment_id', 'product_id', 'import_shipment_id', 'quantity', 'price'];
    for (const index in listItem) {
        sharedController.isValid(listItem[index], requiredFields, 'shipment item')
    }
}

async function insertShipmentItems(listItem = [], isImport) {
    const shipmentItemService = getShipmentItemService(isImport);
    listItem.forEach(async (item) => {
        await shipmentItemService.insert(item);
    });
}

function getBoolFromString(isImport) {
    if(isImport === "true") {
        return true;
    } else if(isImport === "false") {
        return false;
    }
    throw new ApiError(400, "Invalid shipment data!");
}

export async function insert(req, res, next) {
    const isImport = req.body.isImport;
    checkValidShipmentItems(req.body.listItem);
    try {
        const object = getObject(isImport);
        sharedController.isValid(req.body, [object, 'created_by'], 'shipment');
        const result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentService = new ShipmentsService(isImport);
                return await shipmentService.insert(req.body, conn);
            });
        await insertShipmentItems(req.body.listItem);
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the shipment: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    let { isImport, needItems, ...filter } = req.query;
    isImport = getBoolFromString(isImport);
    needItems = getBoolFromString(needItems);
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentService = new ShipmentsService(isImport);
                const shipmentItemService = getShipmentItemService(isImport);
                let result = [];
                const { params } = req.params;
                if(params) {
                    result = await shipmentService.query(params, conn);
                    if(needItems) {
                        result[0].listItem =
                            await shipmentItemService.query({shipment_id: params.value}, conn);
                    }
                } else {
                    result = await shipmentService.query(filter, conn);
                    if(needItems) {
                        for (const shipment of result) {
                            shipment.listItem = 
                                await shipmentItemService.query({shipment_id: shipment.id}, conn);
                        }
                    }
                }
                return result;
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the shipment: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    const isImport = getBoolFromString(req.query.isImport);
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const shipmentService = new ShipmentsService(isImport);
            return await shipmentService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the shipment: ${error}`)
        )
    }
}