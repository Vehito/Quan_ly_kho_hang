// const express = required("express");
import express from "express";
import cors from "cors";
// const cors = required("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome"});
});

export default app;