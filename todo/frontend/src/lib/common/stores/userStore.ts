import { pb } from "$lib/pocketbase/pocketbase";
import { writable } from "svelte/store";
import type { AuthRecord } from "pocketbase";
import { redirect } from "@sveltejs/kit";

type UserState = {
  isLoggedIn: boolean;
  user: AuthRecord | null;
};

/**
 * @returns a store with the current PocketBase user
 */
function userStore() {
  const initialState: UserState = {
    isLoggedIn: pb.authStore.isValid,
    user: pb.authStore.record,
  };

  const { subscribe, set } = writable<UserState>(initialState);

  // Client-side only
  if (typeof window !== "undefined") {
    // listener for auth changes
    pb.authStore.onChange((token, model) => {
      set({
        isLoggedIn: pb.authStore.isValid,
        user: model,
      });
    });
  }

  return {
    subscribe,
    logout: (path: string) => {
      console.log(`Signout user '${pb.authStore.record?.id}'`);
      pb.authStore.clear();
      redirect(303, path);
    },
  };
}

export const user = userStore();
