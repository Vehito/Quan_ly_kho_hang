import express from "express";
import * as shipments from "../controllers/shipments.controller.js";

const route = express.Router();

route.route("/")
    .get(shipments.query)
    .post(shipments.insert);

route.route("/shipment_items")
    .get(shipments.queryShipmentItem);

route.route("/:id")
    .get(shipments.query)
    .delete(shipments.remove);


export default route;