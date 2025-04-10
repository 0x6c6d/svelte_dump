import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from "svelte/store";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvQ7bsz3sV17-BdYxcOK0Oa2XZeArtqkE",
  authDomain: "linktree-68d74.firebaseapp.com",
  projectId: "linktree-68d74",
  storageBucket: "linktree-68d74.firebasestorage.app",
  messagingSenderId: "794669853045",
  appId: "1:794669853045:web:57c6e1ef601b2a399d8b3c",
  measurementId: "G-W0JPEED0DH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

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
