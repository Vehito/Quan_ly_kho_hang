import departmentsModel from "@/models/departments.model";
import Controller from "./controller";

class DepartmentsController extends Controller {
    constructor() {
        super(departmentsModel);
    }

    insert() {return;}
    delete() {return;}
    update() {return;}
}

export default new DepartmentsController();