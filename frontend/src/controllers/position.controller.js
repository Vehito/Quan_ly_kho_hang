import positionsModel from "@/models/positions.model";
import Controller from "./controller";

class PositionsController extends Controller {
    constructor() {
        super(positionsModel);
    }

    insert() {return;}
    delete() {return;}
    update() {return;}
}

export default new PositionsController();