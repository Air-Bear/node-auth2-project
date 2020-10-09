const express = require("express");
const app = express();

const errorHandler = require("./errorHandler");
const authRouter = require("./auth/authRouter");

app.use(express.json());
app.use("/api", authRouter);

app.use(errorHandler)

module.exports = app;