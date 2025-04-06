import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    // create account with supabase
    const supabase = event.locals.supabase;
    const { first_name, last_name, email, password } = form.data;

    // Sign up the user
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: first_name,
          last_name: last_name,
        },
      },
    });

    if (error) {
      console.error("Sign up failed:", error.message);
      return setError(form, "password", error.message);
    } else {
      return redirect(303, "/");
    }
  },
};
