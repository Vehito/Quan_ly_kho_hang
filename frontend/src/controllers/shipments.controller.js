import ShipmentsModel from "@/models/shipments.model";
import Controller from "./controller";
import ShipmentItemModel from "@/models/shipment_items.model";

class ShipmentsController extends Controller {
    constructor(isImport) {
        super(new ShipmentsModel(isImport));
        this.isImport = isImport;
    }

    async queryAll(filter = {}, needItems = false) {
        filter.needItems = needItems;
        return await super.queryAll(filter);
    }

    async queryById(id, needItems = false) {
        return await super.queryById(id, {needItems: needItems})
    }

    async queryAllShipmentItems(filter = {}) {
        const shipmentItemModel = new ShipmentItemModel(this.isImport);
        return await shipmentItemModel.queryAll(filter);
    }
}

export default ShipmentsController;