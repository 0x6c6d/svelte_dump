import PocketBase from "pocketbase";

// TODO: read connection string from config
const pb = new PocketBase("http://localhost:8090");

if (typeof window !== "undefined") {
  pb.authStore.loadFromCookie(document.cookie);
}

export default pb;
