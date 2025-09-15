import {RequestHandler} from "express";
import {getUserByEmailWithPassword} from "@/models/user";
import {CustomValidator} from "express-validator";
import {HashPassword} from "@/lib/hash_password";
import {ForbiddenError, UnauthorizedError} from "@/lib/errors";

export const isMatchEmailAndPassword: CustomValidator = async (_, {req}) => {
  const {email, password} = req.body;
  if (!email || !password) return;
  const user = await getUserByEmailWithPassword(email);
  const match =
    user &&
    user.password &&
    (await new HashPassword().compare(password, user.password));
  if (!match) {
    throw new Error("Invalid email/password combination");
  }
};

export const forbidAuthUser: RequestHandler = (req, res, next) => {
  if (req.currentUser) {
    throw new ForbiddenError("You are already logged in");
  } else {
    next();
  }
};

export const ensureAuthUser: RequestHandler = (req, res, next) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  } else {
    next();
  }
};
