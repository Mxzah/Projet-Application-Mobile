import { executeQuery } from "./client";

export async function getUserById(id_utilisateur) {
  const response = await executeQuery("select-user-by-id/execute", { id_utilisateur });
  return response.success ? response.data[0] : null;
}
