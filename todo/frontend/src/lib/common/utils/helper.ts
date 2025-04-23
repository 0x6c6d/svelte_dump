/**
 * Generates a cryptographically secure random string of a specified length
 * @param length Length of the string to generate (default is 30)
 * @returns A random string containing uppercase, lowercase, numbers, and special characters
 */
export function generateRandomString(length = 30): string {
  // Characters to use in the random string
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let result = "";

  // Use crypto API if available (browser or Node.js)
  if (typeof crypto !== "undefined") {
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomValues[i] % chars.length);
    }
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  return result;
}

/**
 * Deep clones an object, including non-plain JavaScript objects (non-POJOs)
 * @param obj The object to be cloned
 * @returns A deep copy of the original object with all nested structures duplicated
 */
export const cloneNonPOJOs = (obj: any) => {
  return structuredClone(obj);
};
