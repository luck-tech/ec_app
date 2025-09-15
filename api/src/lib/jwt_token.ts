import jwt from "jsonwebtoken";

export const verify = (token: string) => {
  return jwt.verify(token, process.env.AUTH_TOKEN_SECRET) as {id: number};
};

export const sign = (id: number) => {
  return jwt.sign({id}, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: 86400, // 24 hours
  });
};
