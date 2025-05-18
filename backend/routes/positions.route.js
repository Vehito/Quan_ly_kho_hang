import express from "express";
import * as positions from "../controllers/positions.controller.js";

const route = express.Router();

route.route("/")
    .get(positions.query)
    .post(positions.insert);

route.route("/:id")
    .get(positions.query)
    .put(positions.update)
    .delete(positions.remove);

export default route;