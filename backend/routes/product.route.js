import express from "express";
import * as products from "../controllers/product.controller.js";

const route = express.Router();

route.route("/")
    .get(products.findAll)
    .post(products.create);

export default route;