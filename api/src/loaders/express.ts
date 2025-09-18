import express, {Express} from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import logger from "morgan";
import {router as authRouter} from "@/routes/auth";
import {router as productRouter} from "@/routes/product";
import {router as orderRouter} from "@/routes/order";
import {currentUserMiddleware} from "@/middlewares/current_user";
import {errorHandler} from "@/middlewares/error_handler";

export const loadMiddlewares = (app: Express) => {
  loadSecureHeaders(app);
  loadLogger(app);
  loadStatic(app);
  loadBodyParser(app);
  loadCookieParser(app);
  loadUser(app);
  loadRouter(app);
  loadErrorHandler(app);
};

const loadLogger = (app: Express) => {
  app.use(logger("dev"));
};

const loadStatic = (app: Express) => {
  app.use(express.static("public"));
};

const loadBodyParser = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
};

const loadCookieParser = (app: Express) => {
  app.use(cookieParser());
};

/**
 * Pass login information to view
 * null is passed when user is not logged in
 */
const loadUser = (app: Express) => {
  app.use(currentUserMiddleware);
};

const loadRouter = (app: Express) => {
  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);
};

const loadSecureHeaders = (app: Express) => {
  app.use(helmet());
  if (app.get("env") === "development" || app.get("env") === "test") {
    // Setting upgradeInsecureRequests to null in development/test environment
    // since safari redirects to https even on localhost and the page cannot be displayed.
    app.use(
      helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
          upgradeInsecureRequests: null,
        },
      }),
    );
  }
};

const loadErrorHandler = (app: Express) => {
  app.use(errorHandler);
};
