import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import userController from "./controllers/user.controller.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/login", userController.login);
app.post("/api/register", userController.register);

app.listen(PORT, () => console.log(`Started at http://localhost:${PORT}`));
