import { executeQuery } from "./client";

export async function getProgrammes() {
  return executeQuery("select-all-programmes/execute");
}
