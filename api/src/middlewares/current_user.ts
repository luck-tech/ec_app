import {RequestHandler} from "express";
import {getUser} from "@/models/user";
import {AUTH_COOKIE_NAME} from "@/constants";
import {verify} from "@/lib/jwt_token";
/**
 * If logged in, set the user information to currentUser.
 * If not logged in, set null.
 */
export const currentUserMiddleware: RequestHandler = async (req, res, next) => {
  const token: string = req.cookies[AUTH_COOKIE_NAME];
  if (!token) {
    req.currentUser = null;
    return next();
  }
  try {
    const decode = verify(token);
    req.currentUser = await getUser(decode.id);
  } catch {
    req.currentUser = null;
  }
  next();
};
