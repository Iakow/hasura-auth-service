import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import authController from "./controllers/auth.controller.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/auth/login", authController.login);
app.post("/api/auth/register", authController.register);
app.post("/api/auth/refresh", authController.refresh);



app.listen(PORT, () => console.log(`Started at http://localhost:${PORT}`));
