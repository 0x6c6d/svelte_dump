import { cloneNonPOJOs } from "$lib/common/utils/helper";
import type { LayoutServerLoad } from "./$types";

// load the user for all routes below this one (for the whole app)
export const load = (async ({ locals }) => {
  const user = locals.pb.authStore.record;
  console.log("(app):", JSON.stringify(locals.pb.authStore));
  return { user: cloneNonPOJOs(user) };
}) satisfies LayoutServerLoad;
