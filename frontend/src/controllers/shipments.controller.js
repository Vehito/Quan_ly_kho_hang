import ShipmentsModel from "@/models/shipments.model";
import Controller from "./controller";

class ShipmentsController extends Controller {
    constructor(isImport) {
        super(new ShipmentsModel(isImport));
    }

    async queryAll(filter = {}, needItems = false) {
        filter.needItems = needItems;
        return await super.queryAll(filter);
    }
}

export default ShipmentsController;