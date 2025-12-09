class MarthaService {
    #BASE_URL = "http://martha.jh.shawinigan.info/queries";
    #AUTH_TOKEN = "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==";

    async #executeQuery(queryPath, body = null) {
        const url = `${this.#BASE_URL}/${queryPath}`;
        const options = {
            method: "POST",
            headers: {
                auth: this.#AUTH_TOKEN,
                "Content-Type": "application/json",
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        return response.json();
    }

    async getAvisByUser(id_utilisateur) {
        const response = await this.#executeQuery("select-avis-by-user/execute", { id_utilisateur });

        if (!response.success) return [];
        return response.data;
    }

    // 🔹 NOUVEAU : transactions (propositions acceptées) où le user peut écrire/modifier un avis
    async getTransactionsPourAvis(id_utilisateur) {
        const response = await this.#executeQuery(
            "select-propositions-pour-avis/execute",
            { id_utilisateur }
        );

        return response.success ? response.data : [];
    }

    // 🔹 NOUVEAU : créer un avis pour une proposition
    async createAvis({ id_proposition, id_noteur, note, commentaire }) {
        const response = await this.#executeQuery(
            "insert-avis-pour-proposition/execute",
            {
                id_proposition,
                id_noteur,
                note,
                commentaire,
            }
        );

        return response.success;
    }

    // 🔹 NOUVEAU : modifier un avis existant

    async updateAvis({ id_avis, id_noteur, note, commentaire }) {
        const response = await this.#executeQuery("update-avis/execute", {
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




    async getUserById(id_utilisateur) {
        const response = await this.#executeQuery("select-user-by-id/execute", { id_utilisateur });

        return response.success ? response.data[0] : null;
    }

    async getProgrammes() {
        return await this.#executeQuery("select-all-programmes/execute");
    }

    async getCours() {
        return await this.#executeQuery("select-all-cours/execute");
    }

    async getAnnonces() {
        return await this.#executeQuery("select-all-annonces/execute");
    }

    async getAnnonce(id_annonce) {
        return await this.#executeQuery(`select-annonce-by-id/${id_annonce}/execute`);
    }

    async getAnnoncesByUser(id_utilisateur) {
        const response = await this.#executeQuery("select-annonces-by-user/execute", { id_utilisateur });

        if (!response.success) {
            console.log("❌ getAnnoncesByUser erreur:", response);
            return [];
        }

        return response.data;
    }

    async getPropositionsByUser(id_utilisateur) {
        const response = await this.#executeQuery("select-propositions-by-user/execute", { id_utilisateur });

        return response.success ? response.data : [];
    }

    async updatePropositionStatut(id_proposition, id_statut) {
        const response = await this.#executeQuery("update-proposition-statut/execute", { id_proposition, id_statut });

        return response.success;
    }

    async insertProposition(date_proposition, prix, lieu, id_utilisateur, id_annonce, id_statut) {
        const response = await this.#executeQuery("insert-proposition/execute", {
            date_proposition,
            prix,
            lieu,
            id_utilisateur,
            id_annonce,
            id_statut
        });

        return response.success;
    }

    async insertAnnonce(date_fin, prix_demande, lieu, id_utilisateur, id_cours, id_statut, titre = null, description = null, image_base64 = null, date_debut = null) {
        if (!date_debut) {
            const now = new Date();
            date_debut = now.toISOString().split('T')[0];
        }

        const response = await this.#executeQuery("insert-annonce/execute", {
            date_debut,
            date_fin,
            prix_demande,
            lieu,
            id_utilisateur,
            id_cours,
            id_statut,
            titre,
            description,
            image_base64
        });

        if (!response.success) {
            console.error('❌ insertAnnonce erreur:', response);
        }

        return response.success;
    }

    async deleteAnnonce(id_annonce) {
        const response = await this.#executeQuery("delete-annonce/execute", { id_annonce });

        return response.success;
    }

    async updateAnnonce(id_annonce, titre, lieu, description, image_base64, date_debut, date_fin, prix_demande, id_cours, id_utilisateur = null) {
        const body = {
            id_annonce: Number(id_annonce),
            titre: String(titre || ''),
            lieu: String(lieu || ''),
            description: description ? String(description) : null,
            image_base64: image_base64 ? String(image_base64) : null,
            date_debut: String(date_debut || ''),
            date_fin: String(date_fin || ''),
            prix_demande: Number(prix_demande),
            id_cours: id_cours ? Number(id_cours) : null
        };

        if (id_utilisateur !== undefined && id_utilisateur !== null) {
            body.id_utilisateur = Number(id_utilisateur);
        }

        return await this.#executeQuery("update-annonce/execute", body);
    }
}

export default MarthaService;