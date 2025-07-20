import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";

class CustomersModel extends Model {
    constructor() {
        super("/api/customers");
    }

    createIntance(data) {
        return new Customer(data);
    }
}

export default new CustomersModel();

export class Customer {
    constructor(data) {
        this.id = data.id ?? undefined;
        this.name = data.name;
        this.company = data.company ?? null;
        this.address = data.address;
        this.debt = data.debt;
        this.formatted_debt = this.debt?.toLocaleString('vi-VN');
        this.due_date = data.due_date ?? null;
        this.text_due_date = this.due_date ? date_helperUtil.getStringDate(this.due_date) : '';
        this.status = data.status;
        this.text_status = this.status === 1 ? 'Kích hoạt' : 'Không kích hoạt';
    }
    
    static getEmptyObject() {
        return new Customer({
            name: '',
            address: '',
            debt: 0,
            status: 1,
        })
    }

    get isOverdue() {
        if (!this.due_date) return false;
        return new Date(this.due_date) < new Date();
    }
}