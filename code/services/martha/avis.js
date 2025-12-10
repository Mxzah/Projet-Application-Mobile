import { executeQuery } from "./client";

export async function getAvisByUser(id_utilisateur) {
  const response = await executeQuery("select-avis-by-user/execute", { id_utilisateur });
  if (!response.success) return [];
  return response.data;
}

export async function getTransactionsPourAvis(id_utilisateur) {
  const response = await executeQuery("select-propositions-pour-avis/execute", { id_utilisateur });
  return response.success ? response.data : [];
}

export async function createAvis({ id_proposition, id_noteur, note, commentaire }) {
  const response = await executeQuery("insert-avis-pour-proposition/execute", {
    id_proposition,
    id_noteur,
    note,
    commentaire,
  });
  return response.success;
}

export async function updateAvis({ id_avis, id_noteur, note, commentaire }) {
  const response = await executeQuery("update-avis/execute", {
    note,
    commentaire,
    id_avis,
    id_noteur,
  });
  if (!response.success) {
    console.error("❌ updateAvis erreur:", response);
  }
  return response.success;
}
