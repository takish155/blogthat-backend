import { Request } from "express-serve-static-core";

export const checkSession = (req: Request) => {
  if (!req.user) {
    return false;
  }
  return true;
};
