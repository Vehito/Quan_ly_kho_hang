import suppliersModel from "@/models/suppliers.model";
import Controller from "./controller";

class SuppliersController extends Controller {
    constructor() {
        super(suppliersModel);
    }
}

export default new SuppliersController();