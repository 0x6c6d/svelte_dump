import { goto } from "$app/navigation";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { user } from "$lib/stores/user";

const firebaseConfig = {
  apiKey: "AIzaSyCvQ7bsz3sV17-BdYxcOK0Oa2XZeArtqkE",
  authDomain: "linktree-68d74.firebaseapp.com",
  projectId: "linktree-68d74",
  storageBucket: "linktree-68d74.firebasestorage.app",
  messagingSenderId: "794669853045",
  appId: "1:794669853045:web:57c6e1ef601b2a399d8b3c",
  measurementId: "G-W0JPEED0DH",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// client side auth with jwt
// server can't authenticate user (cookies are needed)
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  if (result.user) {
    user.set(result.user);
  }
}

export function signOutUser(redirectUrl: string) {
  return signOut(auth)
    .then(() => {
      goto(redirectUrl);
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
}
