import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
