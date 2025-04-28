import type { CreateRunInput } from "$lib/common/types";
import { pb } from "./pb";

export async function addRunAsync(run: CreateRunInput) {
  const record = await pb.collection("runs").create(run);
  // TODO: 400, 403 error handling
  return record.id;
}

export async function loadRunsAsync() {}
