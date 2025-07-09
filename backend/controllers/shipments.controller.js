import ApiError from "../api-error.js";
import ShipmentsService from "../services/shipments.service.js";
import ImportItemsService from "../services/import_items.service.js";
import ExportItemsService from "../services/export_items.service.js";
import * as sharedController from "./controller.shared.js";
import ProductsService from "../services/products.service.js";

function getObject(isImport) {
    return isImport ? "supplier_id" : "customer_id";
}

function getShipmentItemService(isImport) {
    return isImport ? new ImportItemsService() : new ExportItemsService();
}

function checkValidShipmentItems(listItem = [], isImport) {
    const requiredFields = isImport ? 
        ['product_id', 'mfg', 'exp', 'quantity', 'price'] : 
        ['product_id', 'import_shipment_id', 'quantity', 'price'];
    for (const index in listItem) {
        sharedController.isValid(listItem[index], requiredFields, 'shipment item')
    }
}

async function insertShipmentItems(shipmentId, listItem = [], isImport, conn) {
    const shipmentItemService = getShipmentItemService(isImport);
    const productService = new ProductsService();
    let quantity = 0;
    try {
        for (const item of listItem) {
            item.shipment_id = shipmentId;
            await shipmentItemService.insert(item, conn);
            await productService.adjustQuantity(
                item.product_id, isImport ? item.quantity : -item.quantity, conn
            );
        }
    } catch (error) {
        throw new ApiError(500, `An error occurred while inserting the shipment item: ${error}`);
    }
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
    checkValidShipmentItems(req.body.listItem, isImport);
    try {
        const object = getObject(isImport);
        sharedController.isValid(req.body, [object, 'created_by'], 'shipment');
        const result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentService = new ShipmentsService(isImport);
                const result = await shipmentService.insert(req.body, conn);
                await insertShipmentItems(result.id, req.body.listItem, isImport, conn);
                return result;
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the shipment: ${error}`)
        )
    }
}

export async function queryShipmentItem(req, res, next) {
    let result = [];
    let { isImport, available, ...filter } = req.query;
    isImport = getBoolFromString(isImport);
    isImport === true ? available = getBoolFromString(available) : available;
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentItemService = getShipmentItemService(isImport);
                let result = [];
                result = isImport ? await shipmentItemService.query(filter, conn, available)
                                  : await shipmentItemService.query(filter, conn);
                return result;
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the shipment items: ${error}`)
        );
    }
}

export async function query(req, res, next) {
    let result = [];
    let { isImport, needItems, ...filter } = req.body;
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const shipmentService = new ShipmentsService(isImport);
                let result = [];
                const { id } = req.params;
                const queryFunc = needItems
                    ? shipmentService.queryForReport.bind(shipmentService)
                    : shipmentService.query.bind(shipmentService)
                if(id) {
                    result = await queryFunc({id: id}, conn);
                } else {
                    result = await queryFunc(filter, conn);
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

export async function queryForReport(req, res, next) {
    const { isImport, ...filter } = req.body;
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) =>{
            const shipmentService = new ShipmentsService(isImport);
            return await shipmentService.queryForReport(filter, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the shipment: ${error}`)
        )
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