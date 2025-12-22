import { executeQuery } from "./client";

export async function getPropositionsByUser(id_utilisateur) {
  const response = await executeQuery("select-propositions-by-user/execute", { id_utilisateur });
  return response.success ? response.data : [];
}

export async function getPropositionsSentByUser(id_utilisateur) {
  const response = await executeQuery("select-propositions-sent-by-user/execute", { id_utilisateur });
  return response.success ? response.data : [];
}

export async function updatePropositionStatut(id_proposition, id_statut) {
  const response = await executeQuery("update-proposition-statut/execute", {
    id_proposition,
    id_statut,
  });
  return response.success;
}

export async function deleteProposition(id_proposition) {
  const response = await executeQuery("delete-proposition/execute", { id_proposition });
  return response.success;
}

export async function insertProposition(
  date_proposition,
  prix,
  lieu,
  id_utilisateur,
  id_annonce,
  id_statut
) {
  const response = await executeQuery("insert-proposition/execute", {
    date_proposition,
    prix,
    lieu,
    id_utilisateur,
    id_annonce,
    id_statut,
  });

  return response.success;
}
