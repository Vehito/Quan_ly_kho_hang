import employeesModel from "@/models/employees.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class EmployeesController extends Controller {
    constructor() {
        super(employeesModel);
    }

    async insert(data) {
        data.birth = date_helperUtil.formatDateForMySQL(data.birth);
        await super.insert(data);
    }

    async update(id, data) {
        data.birth = date_helperUtil.formatDateForMySQL(data.birth);
        const editedData = super.deleteAttribute(data, ['department_name', 'password']);
        await super.update(id, editedData);
    }
}

export default new EmployeesController();