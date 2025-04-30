import type { CreateRunInput, Run } from "$lib/common/types";
import { pb } from "./pb";

export async function addRunAsync(run: CreateRunInput) {
  const record = await pb.collection("runs").create(run);
  // TODO: 400, 403 error handling
  return record.id;
}

export async function loadRunsAsync(): Promise<Run[]> {
  const records = await pb.collection("runs").getFullList({
    sort: "-date",
  });

  return records.map((record) => ({
    id: record.id,
    userId: record.userId,
    date: new Date(record.date),
    distance: record.distance,
    comment: record.comment,
  }));
}

export async function deleteRunAsync(id: string) {
  return await pb.collection("runs").delete(id);
}
