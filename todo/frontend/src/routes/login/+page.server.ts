import { goto } from "$app/navigation";
import type { Actions, PageServerLoad } from "./$types.js";
import { requestSignInOTP, verifyOTP } from "$lib/pocketbase/auth.js";
import type { OTPResponse } from "pocketbase";

import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  schemaOtpMail,
  schemaOtpNumber,
} from "$lib/common/schemas/otpSchema.js";

export const load: PageServerLoad = async () => {
  // Different schemas, no id required.
  const mailForm = await superValidate(zod(schemaOtpMail));
  const otpForm = await superValidate(zod(schemaOtpNumber));

  return { mailForm, otpForm };
};

export const actions = {
  mail: async ({ request }) => {
    const mailForm = await superValidate(request, zod(schemaOtpMail));

    if (!mailForm.valid) {
      console.log("Invalid form data: ", mailForm.data.email);
      return message(mailForm, "Invalid form data");
    }

    const result = await requestSignInOTP(mailForm.data.email);
    if (!result.success) {
      console.log("OTP request failed: ", result.message);
      return message(
        mailForm,
        result.message || "Failed to send OTP. Please try again."
      );
    }

    console.log("OTP request success: ", result.message);
    return {
      mailForm,
      message: "Mail form submitted",
      otpResponse: result.data!,
    };
  },

  otp: async ({ request }) => {
    const otpForm = await superValidate(request, zod(schemaOtpNumber));

    if (!otpForm.valid) {
      console.log("Invalid form data: ", otpForm.data.otp);
      return message(otpForm, "Invalid form data");
    }

    const otpResponse: OTPResponse = { otpId: otpForm.data.otpId };
    const result = await verifyOTP(otpResponse, otpForm.data.otp);
    if (!result.success) {
      console.log("Verifying OTP failed: ", result.message);
      otpForm.errors.otp = [`Verifying OTP failed: ${result.message}`];
      return message(
        otpForm,
        result.message || "Failed to verify OTP. Please try again."
      );
    }

    console.log(
      "Verifying OTP success: ",
      result.message,
      JSON.stringify(result.data)
    );
    goto("/");
  },
} satisfies Actions;
