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
        try {
            const shipmentItemModel = new ShipmentItemModel(this.isImport);
            return await shipmentItemModel.queryAll(filter);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async insert(data) {
        try {
            const shipmentsModel = new ShipmentsModel(this.isImport, 'create');
            return await shipmentsModel.insert(data);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }
}

export default ShipmentsController;