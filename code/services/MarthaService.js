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

}

export default new MarthaService();
