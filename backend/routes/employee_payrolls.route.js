import express from "express";
import * as employeePayrolls from "../controllers/employee_payrolls.controller.js";

const route = express.Router();

route.route("/")
    .get(employeePayrolls.query)
    .post(employeePayrolls.insert);

route.route("/:id")
    .get(employeePayrolls.query)
    .put(employeePayrolls.update)
    .delete(employeePayrolls.remove);

export default route;