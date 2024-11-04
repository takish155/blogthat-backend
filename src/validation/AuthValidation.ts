import { z } from "zod";

export default class AuthValidation {
  public static authValidation = {
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_-]+$/, { message: "KEYWORD_INVALID" }),
    password: z.string().min(6).max(100),
    email: z.string().email().max(100),
  };

  public static signInValidation = z.object({
    username: this.authValidation.username,
    password: this.authValidation.password,
  });

  public static signUpValidation = z.object({
    username: this.authValidation.username,
    email: this.authValidation.email,
    password: this.authValidation.password,
    confirmPassword: this.authValidation.password,
  });
}

export type SignInType = z.infer<typeof AuthValidation.signInValidation>;
export type SignUpType = z.infer<typeof AuthValidation.signUpValidation>;
