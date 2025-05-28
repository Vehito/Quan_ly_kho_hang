import ShipmentsModel from "@/models/shipments.model";
import Controller from "./controller";

class ShipmentsController extends Controller {
    constructor(isImport) {
        super(new ShipmentsModel(isImport));
    }
}

export default ShipmentsController;