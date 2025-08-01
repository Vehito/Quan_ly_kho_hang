import express from "express";
import cors from "cors";
import * as routers from "./routes/routers.js"
import ApiError from "./api-error.js";
import * as auth from "./utils/auth.util.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(cors({
    credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome"});
});

app.use(express.static('public'));

app.use("/api/products" , auth.authenticateToken, routers.productsRouter);
app.use("/api/customers", auth.authenticateToken, routers.customersRouter);
app.use("/api/departments", auth.authenticateToken, routers.departmentsRouter);
app.use("/api/employees", auth.authenticateToken, routers.employeesRouter);
app.use("/api/suppliers", auth.authenticateToken, routers.suppliersRouter);
app.use("/api/shipments", auth.authenticateToken, routers.shipmentsRouter);
app.use("/api/employee_payrolls", auth.authenticateToken, routers.employeePayrollsRouter);
app.use("/api/monthly_payrolls", auth.authenticateToken, routers.monthlyPayrollsRouter);
app.use("/api/auth", routers.authRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;