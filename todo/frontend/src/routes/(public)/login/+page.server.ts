import type { Actions, PageServerLoad } from "./$types.js";
import { requestSignInOTP } from "$lib/pocketbase/auth.js";
import { redirect } from "@sveltejs/kit";

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

// TODO: remove the pocketbase/auth.ts file and to all the stuff here
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

  otp: async ({ request, locals }) => {
    const otpForm = await superValidate(request, zod(schemaOtpNumber));

    if (!otpForm.valid) {
      console.log("Invalid form data: ", otpForm.data.otp);
      return message(otpForm, "Invalid form data");
    }

    const authData = await locals.pb
      .collection("users")
      .authWithOTP(otpForm.data.otpId, otpForm.data.otp);
    if (!authData) {
      console.log("Verifying OTP failed: ");
      otpForm.errors.otp = [`Verifying OTP failed:`];
      return message(otpForm, "Failed to verify OTP. Please try again.");
    }

    console.log("Verifying OTP success: ", JSON.stringify(authData));
    redirect(303, "/dashboard");
  },
  logout: async ({ locals }) => {
    console.log("Logout user:", JSON.stringify(locals.pb.authStore));
    await locals.pb.authStore.clear();
    throw redirect(303, "/login");
  },
} satisfies Actions;
