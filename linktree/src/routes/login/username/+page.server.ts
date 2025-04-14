import type { PageServerLoad } from "./$types";
import { usernameSchema } from "$lib/schemas/username";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(usernameSchema)),
  };
};
