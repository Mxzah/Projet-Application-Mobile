import { executeQuery } from "./client";

export async function getAnnonces() {
  return executeQuery("select-all-annonces/execute");
}

export async function getAnnonce(id_annonce) {
  return executeQuery(`select-annonce-by-id/${id_annonce}/execute`);
}

export async function getAnnoncesByUser(id_utilisateur) {
  const response = await executeQuery("select-annonces-by-user/execute", { id_utilisateur });
  if (!response.success) {
    console.log("❌ getAnnoncesByUser erreur:", response);
    return [];
  }
  return response.data;
}

export async function insertAnnonce(
  date_fin,
  prix_demande,
  lieu,
  id_utilisateur,
  id_cours,
  id_statut,
  titre = null,
  description = null,
  image_base64 = null,
  date_debut = null
) {
  if (!date_debut) {
    const now = new Date();
    date_debut = now.toISOString().split("T")[0];
  }

  const response = await executeQuery("insert-annonce/execute", {
    date_debut,
    date_fin,
    prix_demande,
    lieu,
    id_utilisateur,
    id_cours,
    id_statut,
    titre,
    description,
    image_base64,
  });

  if (!response.success) {
    console.error("❌ insertAnnonce erreur:", response);
  }

  return response.success;
}

export async function deleteAnnonce(id_annonce) {
  const response = await executeQuery("delete-annonce/execute", { id_annonce });
  return response.success;
}

export async function markAnnonceAsSold(id_annonce) {
  const response = await executeQuery("mark-annonce-sold/execute", { 
    id_annonce: Number(id_annonce),
    est_vendue: true 
  });
  if (!response.success) {
    console.error("❌ markAnnonceAsSold erreur:", response);
  }
  return response.success;
}

export async function updateAnnonce(
  id_annonce,
  titre,
  lieu,
  description,
  image_base64,
  date_debut,
  date_fin,
  prix_demande,
  id_cours,
  id_utilisateur = null
) {
  const body = {
    id_annonce: Number(id_annonce),
    titre: String(titre || ""),
    lieu: String(lieu || ""),
    description: description ? String(description) : null,
    image_base64: image_base64 ? String(image_base64) : null,
    date_debut: String(date_debut || ""),
    date_fin: String(date_fin || ""),
    prix_demande: Number(prix_demande),
    id_cours: id_cours ? Number(id_cours) : null,
  };

  if (id_utilisateur !== undefined && id_utilisateur !== null) {
    body.id_utilisateur = Number(id_utilisateur);
  }

  const response = await executeQuery("update-annonce/execute", body);
  if (!response.success) {
    console.error("❌ updateAnnonce erreur:", response);
  }
  return response.success;
}
