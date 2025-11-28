class Annonce {
    #id_annonce;

    constructor({
            id_annonce,
            titre,
            lieu = null,
            description = null,
            image_base64 = null,
            date_debut = null,
            date_fin = null,
            prix_demande = null,
            id_cours = null,
            id_utilisateur = null
    }) {
            this.#id_annonce = id_annonce;
            this.titre = titre;
            this.lieu = lieu;
            this.description = description;
            this.image_base64 = image_base64;
            this.date_debut = date_debut;
            this.date_fin = date_fin;
            this.prix_demande = prix_demande;
            this.id_cours = id_cours;
            this.id_utilisateur = id_utilisateur;
    }

    get id_annonce() {
            return this.#id_annonce;
    }

    toJSON() {
            return {
                    id_annonce: this.#id_annonce,
                    titre: this.titre,
                    lieu: this.lieu,
                    description: this.description,
                    image_base64: this.image_base64,
                    date_debut: this.date_debut,
                    date_fin: this.date_fin,
                    prix_demande: this.prix_demande,
                    id_cours: this.id_cours,
                    id_utilisateur: this.id_utilisateur
            };
    }
}

export default Annonce;
