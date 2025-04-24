import { cloneNonPOJOs } from "$lib/common/utils/helper";
import type { AuthRecord } from "pocketbase";
import type { LayoutServerLoad } from "./$types";

// load the user for all routes below this one (for the whole app)
export const load = (async ({ locals }) => {
  const user = locals.pb.authStore.record;
  return { user: cloneNonPOJOs(user) as AuthRecord | null };
}) satisfies LayoutServerLoad;
