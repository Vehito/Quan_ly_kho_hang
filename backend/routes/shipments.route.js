import express from "express";
import * as shipments from "../controllers/shipments.controller.js";

const route = express.Router();

route.route("/")
    .post(shipments.query);

route.route("/create")
    .post(shipments.insert);

route.route("/shipment_items")
    .get(shipments.queryShipmentItem);

route.route("/:id")
    .post(shipments.query)
    .delete(shipments.remove);

route.route("/report")
    .post(shipments.queryForReport);

export default route;