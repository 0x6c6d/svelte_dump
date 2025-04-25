import { z } from "zod";

export const schemaMail = z.object({
  email: z.string().email(),
});

export const schemaOtp = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
  otpId: z.string(),
});
