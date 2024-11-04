import { z } from "zod";
import AuthValidation from "./AuthValidation";

const { authValidation } = AuthValidation;

export default class UserValidation {
  public static updateUsername = z.object({
    username: authValidation.username,
    password: authValidation.password,
  });

  public static updateEmail = z.object({
    email: authValidation.email,
    password: authValidation.password,
  });

  public static updatePassword = z.object({
    password: authValidation.password,
    newPassword: authValidation.password,
  });
}

export type UpdateUsernameType = z.infer<typeof UserValidation.updateUsername>;
export type UpdateEmailType = z.infer<typeof UserValidation.updateEmail>;
export type UpdatePasswordType = z.infer<typeof UserValidation.updatePassword>;
