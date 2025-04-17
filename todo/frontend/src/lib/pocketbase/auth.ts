import type { OTPResponse } from "pocketbase";
import { pb } from "./pocketbase";

/**
 * Handles OTP authentication flow
 * @param email User's email address
 * @returns Promise resolving to the auth data on successful authentication
 */
export async function requestSignInOTP(email: string) {
  try {
    // send OTP email to the provided auth record
    console.log("Request OTP for mail: ", email);
    const result = await pb.collection("users").requestOTP(email);

    return {
      success: true,
      message: "OTP has been sent to your email",
      data: result,
    };
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
      data: null,
    };
  }
}

/**
 * Verifies and completes the OTP authentication process
 * @param result The OTPResponse from the requestSignInOTP() function
 * @param otp The OTP received via email
 * @returns Promise resolving to auth data
 */
export async function verifyOTP(result: OTPResponse, otp: string) {
  try {
    // authenticate with the requested OTP id and the OTP
    console.log("Try to sign in with OTP: ", otp);
    const authData = await pb
      .collection("users")
      .authWithOTP(result.otpId, otp);

    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.record?.id);

    return {
      success: true,
      message: "OTP verified successfully",
      data: authData,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to verify OTP",
      data: null,
    };
  }
}
