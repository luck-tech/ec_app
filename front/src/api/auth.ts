import {throwResponseError} from "@/lib/error";
import {Credentials, User} from "@/types";

export const login = async (creadentials: Credentials): Promise<User> => {
  const url = `/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creadentials),
  });
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const logout = async (): Promise<void> => {
  const url = `/api/auth/logout`;
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (!res.ok) {
    await throwResponseError(res);
  }
  return;
};

export const getCurrentUser = async (): Promise<{user: User | undefined}> => {
  const url = `/api/auth/me`;
  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};
