import express from "express";
import * as products from "../controllers/products.controller.js";

const route = express.Router();

route.route("/")
    .get(products.query)
    .post(products.insert);

route.route("/:id")
    .get(products.query)
    .put(products.update)
    .delete(products.remove);

export default route;