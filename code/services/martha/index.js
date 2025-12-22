import { getAvisByUser, getTransactionsPourAvis, createAvis, updateAvis, deleteAvis } from "./avis";
import { getUserById } from "./users";
import { getProgrammes } from "./programmes";
import { getCours } from "./cours";
import {
  getAnnonces,
  getAnnonce,
  getAnnoncesByUser,
  insertAnnonce,
  deleteAnnonce,
  updateAnnonce,
  markAnnonceAsSold,
} from "./annonces";
import {
  getPropositionsByUser,
  getPropositionsSentByUser,
  deleteProposition,
  updatePropositionStatut,
  insertProposition,
} from "./propositions";
import { signUp, logIn } from "./auth";

export {
  getAvisByUser,
  getTransactionsPourAvis,
  createAvis,
  updateAvis,
  deleteAvis,
  getUserById,
  getProgrammes,
  getCours,
  getAnnonces,
  getAnnonce,
  getAnnoncesByUser,
  insertAnnonce,
  deleteAnnonce,
  updateAnnonce,
  markAnnonceAsSold,
  getPropositionsByUser,
  getPropositionsSentByUser,
  deleteProposition,
  updatePropositionStatut,
  insertProposition,
  signUp,
  logIn,
};

const marthaService = {
  getAvisByUser,
  getTransactionsPourAvis,
  createAvis,
  updateAvis,
  deleteAvis,
  getUserById,
  getProgrammes,
  getCours,
  getAnnonces,
  getAnnonce,
  getAnnoncesByUser,
  insertAnnonce,
  deleteAnnonce,
  updateAnnonce,
  markAnnonceAsSold,
  getPropositionsByUser,
  getPropositionsSentByUser,
  deleteProposition,
  updatePropositionStatut,
  insertProposition,
  signUp,
  logIn,
};

export default marthaService;
