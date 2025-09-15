import express from "express";
import "express-async-errors";
import {loadMiddlewares} from "@/loaders/express";

export const app = express();
loadMiddlewares(app);
