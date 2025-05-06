import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, "username must contain atleast 2 characters")
    .max(20, "username can't contain more 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username can't contain special characters"),

  email: z.string().email({ message: "invalid email address" }),
  
  password: z
    .string()
    .min(6, { message: "passowrd must contain atleast 6 characters" })
    .regex(/^[A-Z]/, {
      message: "Password must start with an uppercase letter",
    }) // First character must be uppercase
    .regex(/.*\d.*/, { message: "Password must contain at least one digit" }) // At least one digit
    .regex(/.*[!@#$%^&*(),.?":{}|<>].*/, {
      message: "Password must contain at least one special character",
    }),
});
