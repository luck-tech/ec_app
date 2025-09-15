import express from "express";
import {body, validationResult} from "express-validator";
import {
  forbidAuthUser,
  isMatchEmailAndPassword,
  ensureAuthUser,
} from "@/middlewares/authentication";
import {getUser, getUserByEmail} from "@/models/user";
import {AUTH_COOKIE_NAME} from "@/constants";
import jwt from "jsonwebtoken";
import {NotFoundError, ValidationError} from "@/lib/errors";
import {sign} from "@/lib/jwt_token";

export const router = express.Router();

/** An endpoint to log in */
router.post(
  "/login",
  forbidAuthUser,
  body("email", "Email can't be blank").notEmpty(),
  body("password", "Password can't be blank").notEmpty(),
  body("custom").custom(isMatchEmailAndPassword),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }

    const {email} = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      throw new NotFoundError();
    }

    const token = sign(user.id);

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });

    res.status(200).json({
      user: user,
    });
  },
);

router.get("/me", async (req, res) => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (!token) {
    res.status(200).json({user: null});
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET) as {
      id: number;
    };
    const user = await getUser(decoded.id);
    if (!user) {
      res.status(200).json({user: null});
      return;
    }
    res.status(200).json({user});
  } catch (error) {
    console.error(error);
    res.status(200).json({user: null});
  }
});

/** An endpoint to log out */
router.delete("/logout", ensureAuthUser, (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.status(200).send();
});
