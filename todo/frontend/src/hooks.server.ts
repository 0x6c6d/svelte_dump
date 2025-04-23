import { pb } from "$lib/pocketbase/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";
import { building } from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {
  // added pb to locals via app.d.ts
  event.locals.pb = pb;

  // public routes that don't require authentication
  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(event.url.pathname);

  if (isPublicRoute || building) {
    return await resolve(event);
  }

  // for protected routes check auth
  console.log(`Trying to access protected route '${event.url.pathname}'`);
  const cookie = event.cookies.get("pb_auth");

  if (!cookie) {
    console.log("No auth cookie found");
    throw redirect(303, "/login");
  }

  try {
    pb.authStore.loadFromCookie(`pb_auth=${cookie}`);
    if (!pb.authStore.isValid) {
      console.log("Invalid auth token");
      throw redirect(303, "/login");
    }

    await pb.collection("users").authRefresh();
    event.locals.pb = pb;
    console.log("Auth refresh success");
  } catch (err) {
    // clear invalid cookie
    event.cookies.set("pb_auth", "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });

    console.log("Auth refresh failed:", err);
    throw redirect(303, "/login");
  }

  const response = await resolve(event);
  if (pb.authStore.isValid) {
    const exportCookie = pb.authStore.exportToCookie({ sameSite: "lax" });
    response.headers.append("set-cookie", exportCookie);
  }

  return response;
};
