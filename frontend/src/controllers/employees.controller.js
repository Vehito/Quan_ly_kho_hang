import employeesModel from "@/models/employees.model";
import Controller from "./controller";

class EmployeesController extends Controller {
    constructor() {
        super(employeesModel);
    }
}

export default new EmployeesController();