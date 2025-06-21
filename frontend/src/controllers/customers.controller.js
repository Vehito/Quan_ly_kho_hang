import customersModel from "@/models/customers.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class CustomersController extends Controller {
    constructor() {
        super(customersModel);
    }

    async insert(data) {
        const editedData = super.deleteAttribute(data, ['text_status', 'text_due_date']);
        return await super.insert(editedData);
    }

    async update(id, data) {
        data.due_date = date_helperUtil.formatDateForMySQL(data.due_date);
        const editedData = super.deleteAttribute(data, ['text_status', 'text_due_date']);
        return await super.update(id, editedData);
    }
}

export default new CustomersController();