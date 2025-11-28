class MarthaService {

    async getAvisByUser(id_utilisateur) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/select-avis-by-user/execute",
            {
                method: "POST",
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_utilisateur }),
            }
        ).then(r => r.json());

        if (!response.success) return [];
        return response.data;  // <= objets DB bruts
    }

    async getUserById(id_utilisateur) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/select-user-by-id/execute",
            {
                method: "POST",
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_utilisateur }),
            }
        ).then(r => r.json());

        return response.success ? response.data[0] : null;
    }

    async getProgrammes() {
        const response = await fetch('http://martha.jh.shawinigan.info/queries/select-all-programmes/execute', {
            method: 'POST',
            headers: {
                auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
            },
        });
        return response.json();
    }

    async getCours() {
        const response = await fetch('http://martha.jh.shawinigan.info/queries/select-all-cours/execute', {
            method: 'POST',
            headers: {
                auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
            },
        });
        return response.json();
    }

    async getAnnonces() {
        const response = await fetch('http://martha.jh.shawinigan.info/queries/select-all-annonces/execute', {
            method: 'POST',
            headers: {
                auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
            },
        });
        return response.json();
    }

    async getAnnonce(id_annonce) {
        const response = await fetch(`http://martha.jh.shawinigan.info/queries/select-annonce-by-id/${id_annonce}/execute`, {
            method: 'POST',
            headers: {
                auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
            },
        });
        return response.json();
    }

    async getAnnoncesByUser(id_utilisateur) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/select-annonces-by-user/execute",
            {
                method: "POST",
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_utilisateur }),
            }
        ).then((r) => r.json());

        if (!response.success) {
            console.log("❌ getAnnoncesByUser erreur:", response);
            return [];
        }

        return response.data; // tableau d'annonces
    }

    async getPropositionsByUser(id_utilisateur) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/select-propositions-by-user/execute",
            {
                method: "POST",
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_utilisateur }),
            }
        ).then(r => r.json());

        return response.success ? response.data : [];
    }

    // 🔹 NOUVEAU : update statut (accepter / refuser)
    async updatePropositionStatut(id_proposition, id_statut) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/update-proposition-statut/execute",
            {
                method: "POST",
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_proposition, id_statut }),
            }
        ).then(r => r.json());

        return response.success;
    }
}

export default MarthaService;