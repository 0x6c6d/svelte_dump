import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { user } from "$lib/stores/user";

let initialized = false;

export function initAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, (firebaseUser) => {
    user.set(firebaseUser);
    console.log(
      "Auth state changed:",
      firebaseUser ? `Signed in ${firebaseUser.displayName}` : "Signed out"
    );
  });
}
