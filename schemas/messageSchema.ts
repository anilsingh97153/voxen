import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "content must have atleast 10 characters")
    .max(300, "content can't contain more than 300 characters"),
});
