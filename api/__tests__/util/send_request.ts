import {AUTH_COOKIE_NAME} from "@/constants";
import {sign} from "@/lib/jwt_token";
import {JSONValue} from "@tests/util/schema";
import "cross-fetch/polyfill";

export const sendGetRequest = async ({
  path,
  expectedStatusCode,
  userId,
}: {
  path: string;
  expectedStatusCode: number;
  userId: number | null;
}) => {
  let res: Response;

  if (userId) {
    const token = sign(userId);
    res = await fetch(`${process.env.API_URL}/${path}`, {
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
    });
  } else {
    res = await fetch(`${process.env.API_URL}/${path}`);
  }

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};

export const sendPostRequest = async ({
  path,
  expectedStatusCode,
  userId,
  body,
}: {
  path: string;
  expectedStatusCode: number;
  userId: number | null;
  body?: JSONValue;
}) => {
  let res: Response;

  if (userId) {
    const token = sign(userId);
    res = await fetch(`${process.env.API_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
  } else {
    res = await fetch(`${process.env.API_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
  }

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};
