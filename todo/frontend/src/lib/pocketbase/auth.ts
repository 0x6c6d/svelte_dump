import { pb } from "./client";
import { generateRandomString } from "$lib/common/utils/helper";

/**
 * Checks if a user with the given email already exists
 * @param email User's email address
 * @returns Promise resolving to boolean indicating if user exists
 */
export async function checkIfUserExists(email: string): Promise<boolean> {
  try {
    await pb.collection("users").getList(1, 1, {
      filter: pb.filter("email ~ {:mail}", { mail: email }),
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a new user with the given email
 * @param email User's email address
 * @returns Promise resolving to the created user data
 */
export async function createUser(email: string) {
  try {
    const tempPassword = generateRandomString();

    const userData = {
      email: email,
      password: tempPassword,
      passwordConfirm: tempPassword,
      emailVisibility: true,
    };

    const createdUser = await pb.collection("users").create(userData);
    if (!createdUser.id) {
      console.log(`Failed to create user ${email}`);
      return {
        success: false,
        message: "Error creating user",
      };
    }

    console.log(`User ${email} created successfully`);
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

/**
 * Handles OTP authentication flow - checks if user exists,
 * creates user if needed, then sends OTP
 * @param email User's email address
 * @returns Promise resolving to the auth data on successful authentication
 */
export async function requestSignInOTP(email: string) {
  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      console.log(`User ${email} doesn't exist`);
      const createResult = await createUser(email);
      if (!createResult.success) {
        return {
          success: false,
          message: createResult.message,
          data: null,
        };
      }
    }

    console.log("Request OTP for mail: ", email);
    const result = await pb.collection("users").requestOTP(email);
    return {
      success: true,
      message: "OTP has been sent to your email",
      data: result,
    };
  } catch (error) {
    console.error("Error in authentication flow:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Authentication failed",
      data: null,
    };
  }
}
