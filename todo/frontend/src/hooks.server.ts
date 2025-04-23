import PocketBase from "pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

// MIDDLEWARE
// every request goes through the "authentication" & "authorization" methods
export const authentication: Handle = async ({ event, resolve }) => {
  console.log("\n\nAUTHENTICATION");

  // TODO: read connection string from config
  event.locals.pb = new PocketBase("http://localhost:8090");

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);
  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  return response;
};

const unprotectedRoutes = ["/", "/login"];
export const authorization: Handle = async ({ event, resolve }) => {
  console.log("\n\nAUTHORIZATION");
  console.log("URL:", event.url.pathname);

  // if user tries to access protected routes & isn't logged in, redirect the user to /login
  const isUnprotected = unprotectedRoutes.includes(event.url.pathname);

  if (!isUnprotected) {
    const isLoggedIn = event.locals.pb.authStore?.isValid;
    if (!isLoggedIn) {
      console.log("User not logged in. Redirecting to /login.");
      throw redirect(303, "/login");
    }
  }

  // If the request is still here, just proceed as normally
  const result = await resolve(event);
  return result;
};

export const handle = sequence(authentication, authorization);
