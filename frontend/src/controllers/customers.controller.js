import customersModel from "@/models/customers.model";
import Controller from "./controller";

class CustomersController extends Controller {
    constructor() {
        super(customersModel);
    }
}

export default new CustomersController();