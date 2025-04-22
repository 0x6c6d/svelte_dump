import pb from "$lib/pocketbase/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";
import { building } from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {
  // locals interface was added to the app.d.ts
  event.locals.pb = pb;

  const isAuth: boolean = event.url.pathname === "/login";
  if (isAuth || building) {
    // clear the pb_auth cookie
    event.cookies.set("pb_auth", "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
    return await resolve(event);
  }

  const cookie = event.cookies.get("pb_auth");
  if (!cookie) {
    console.log("Session expired");
    throw redirect(303, "/login");
  }

  try {
    pb.authStore.loadFromCookie(`pb_auth=${cookie}`);
    await pb.collection("users").authRefresh();
    event.locals.pb = pb;
  } catch (_) {
    throw redirect(303, "/login");
  }

  if (!event.locals.pb.authStore.record.id) {
    throw redirect(303, "/login");
  }

  const response = await resolve(event);
  const exportCookie = event.locals.pb.authStore.exportToCookie({
    sameSite: "lax",
  });
  response.headers.append("set-cookie", exportCookie);
  return response;
};
