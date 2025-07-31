import express from "express";
import * as monthlyPayrolls from "../controllers/monthly_payrolls.controller.js";

const route = express.Router();

route.route("/")
    .get(monthlyPayrolls.query)
    .post(monthlyPayrolls.insert);

route.route("/:id")
    .get(monthlyPayrolls.query)
    .put(monthlyPayrolls.update)
    .delete(monthlyPayrolls.remove);

export default route;