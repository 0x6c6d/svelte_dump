import PocketBase, { ClientResponseError } from "pocketbase";
import { writable } from "svelte/store";
import { generateRandomString } from "./utils/helper";

// TODO: add url from config
export const pb = new PocketBase("http://localhost:8090");

// ---------------- AUTH -------------------
/**
 * A writable store that holds the current authenticated user's record.
 * This can be subscribed to for reactive updates across the app.
 */
export const user = writable(pb.authStore.record);

pb.authStore.onChange((auth) => {
  console.log("authStore changed", auth);
  user.set(pb.authStore.record);
});

/**
 * Signs out the currently authenticated user.
 * Clears the authentication store and resets user-related data.
 */
export function signOut() {
  pb.authStore.clear();
}

/**
 * Handles OTP authentication flow - ensures user exists before requesting OTP
 * @param email User's email address
 * @returns Promise resolving to the auth data on successful authentication
 */
export async function requestSignInOTP(email: string) {
  try {
    console.log("Starting OTP flow for email:", email);

    // Try to create the user first
    try {
      const password = generateRandomString();
      await pb.collection("users").create({
        email: email,
        password: password,
        passwordConfirm: password,
        emailVisibility: true,
      });
      console.log(`Created new user for ${email}`);
    } catch (error) {
      // Check if error is a ClientResponseError and has the unique validation error
      if (error instanceof ClientResponseError) {
        if (
          error.status === 400 &&
          Object.keys(error.data.data).includes("email") &&
          error.data?.data?.email?.code === "validation_not_unique"
        ) {
          console.log(`User with email ${email} already exists`);
        } else {
          console.error("Unexpected ClientResponseError:", error);
          return {
            success: false,
            message: error.message || "Failed during user creation",
            data: null,
          };
        }
      } else {
        console.error("Unexpected error during user creation:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed during user creation",
          data: null,
        };
      }
    }

    // Now we know the user exists (either it existed already or we just created it)
    // So we can request the OTP
    console.log("Requesting OTP for:", email);
    const otpResponse = await pb.collection("users").requestOTP(email);

    return {
      success: true,
      message: "OTP has been sent to your email",
      data: otpResponse,
    };
  } catch (error) {
    console.error("Error in OTP request flow:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
      data: null,
    };
  }
}
