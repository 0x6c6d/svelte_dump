import { goto } from "$app/navigation";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { writable } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyCvQ7bsz3sV17-BdYxcOK0Oa2XZeArtqkE",
  authDomain: "linktree-68d74.firebaseapp.com",
  projectId: "linktree-68d74",
  storageBucket: "linktree-68d74.firebasestorage.app",
  messagingSenderId: "794669853045",
  appId: "1:794669853045:web:57c6e1ef601b2a399d8b3c",
  measurementId: "G-W0JPEED0DH",
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

// AUTH --------------------------------------------------------

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  // checks if firebase auth is initialized and the code runs in the browser (not the server)
  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  // set function is a listener for auth state changes & getrs triggered when the user
  // logs in / out (gets the information by the function "onAuthStateChanged")
  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    // runs when the last subscriber unsubscribes from the store
    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();

// client side auth with jwt
// server can't authenticate user (cookies are needed)
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  if (result.user) {
    console.log("User logged in: " + result.user);
  }
}

export function signOutUser(redirectUrl: string) {
  return signOut(auth)
    .then(() => {
      console.log("User signed out");
      goto(redirectUrl);
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
}
