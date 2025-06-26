import ShipmentsModel from "@/models/shipments.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

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