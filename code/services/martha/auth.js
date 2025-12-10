import { executeQuery } from "./client";

export async function signUp(credentials) {
  return executeQuery("insert-user/execute", credentials);
}

export async function logIn({ courriel, mot_de_passe }) {
  return executeQuery("select-user-auth/execute", { courriel, mot_de_passe });
}
