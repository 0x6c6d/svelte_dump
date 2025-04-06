import { z } from "zod";

export const formSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export type FormSchema = typeof formSchema;
