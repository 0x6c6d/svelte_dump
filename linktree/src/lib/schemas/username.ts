import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(15, { message: "Username cannot exceed 15 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers and underscores",
    }),
});
