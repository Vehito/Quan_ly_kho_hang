import express from "express";
import cors from "cors";
import * as routers from "./routes/routers.js"
import ApiError from "./api-error.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome"});
});

app.use("/api/products", routers.productsRouter);
app.use("/api/customers", routers.customersRouter);
app.use("/api/positions", routers.positionsRouter);
app.use("/api/employees", routers.employeesRouter);
app.use("/api/suppliers", routers.suppliersRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;