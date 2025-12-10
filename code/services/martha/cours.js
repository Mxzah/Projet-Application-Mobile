import { executeQuery } from "./client";

export async function getCours() {
  return executeQuery("select-all-cours/execute");
}
