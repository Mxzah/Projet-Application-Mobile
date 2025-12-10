import { getAvisByUser, getTransactionsPourAvis, createAvis, updateAvis } from "./avis";
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
} from "./annonces";
import {
  getPropositionsByUser,
  updatePropositionStatut,
  insertProposition,
} from "./propositions";
import { signUp, logIn } from "./auth";

export {
  getAvisByUser,
  getTransactionsPourAvis,
  createAvis,
  updateAvis,
  getUserById,
  getProgrammes,
  getCours,
  getAnnonces,
  getAnnonce,
  getAnnoncesByUser,
  insertAnnonce,
  deleteAnnonce,
  updateAnnonce,
  getPropositionsByUser,
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
  getUserById,
  getProgrammes,
  getCours,
  getAnnonces,
  getAnnonce,
  getAnnoncesByUser,
  insertAnnonce,
  deleteAnnonce,
  updateAnnonce,
  getPropositionsByUser,
  updatePropositionStatut,
  insertProposition,
  signUp,
  logIn,
};

export default marthaService;
