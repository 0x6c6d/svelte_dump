import PocketBase from "pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const authentication: Handle = async ({ event, resolve }) => {
  console.log("Cookie before load:", event.request.headers.get("cookie"));

  // TODO: read connection string from config
  event.locals.pb = new PocketBase("http://localhost:8090");

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

  console.log(
    "Auth store valid after load:",
    event.locals.pb.authStore.isValid
  );

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection("users").authRefresh());
  } catch (error: any) {
    console.error("Auth refresh detailed error:", error.message, error.status);
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }

  console.log(
    "Auth store valid after refresh:",
    event.locals.pb.authStore.isValid
  );
  console.log(
    "Auth store model after refresh:",
    event.locals.pb.authStore.record
  );

  const response = await resolve(event);

  const cookieToExport = event.locals.pb.authStore.exportToCookie({
    sameSite: "Lax",
  });
  console.log("Exporting cookie:", cookieToExport);

  response.headers.append("set-cookie", cookieToExport);
  return response;
};

const unprotectedPrefix = ["/", "/login"];
export const authorization: Handle = async ({ event, resolve }) => {
  // if user tries to access protected routes & isn't logged in, redirect the user to /login
  if (!unprotectedPrefix.some((path) => event.url.pathname.startsWith(path))) {
    const loggedIn = await event.locals.pb.authStore;
    if (!loggedIn) {
      throw redirect(303, "/login");
    }
  }

  // If the request is still here, just proceed as normally
  const result = await resolve(event);
  return result;
};

export const handle = sequence(authentication, authorization);
