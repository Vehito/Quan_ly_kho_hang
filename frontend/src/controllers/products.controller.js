import productsModel from "@/models/products.model";
import Controller from "./controller";

class ProductsController extends Controller {
    constructor() {
        super(productsModel);
    }
}

export default new ProductsController();