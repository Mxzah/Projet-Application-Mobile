import User from "../screens/auth/User.model.js";


class AuthService {
    #currentUser = null

    get currentUser() {
        return this.#currentUser
    }

    async signUp(credentials) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/insert-user/execute",
            {
                method: "POST",
                body: JSON.stringify(credentials),
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
            }
        ).then((r) => r.json());

        if (response.success) {
            this.#currentUser = new User({
                id: response.lastInsertId,
                username: credentials.courriel,
                nom: credentials.nom,
                prenom: credentials.prenom
            });

        }

        return !!this.#currentUser;
    }



    async logIn({ courriel, mot_de_passe }) {
        const response = await fetch(
            "http://martha.jh.shawinigan.info/queries/select-user-auth/execute",
            {
                method: "POST",
                body: JSON.stringify({ courriel, mot_de_passe }),
                headers: {
                    auth: "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==",
                    "Content-Type": "application/json",
                },
            }
        ).then(r => r.json());

        if (response.success && response.data.length === 1) {
            const u = response.data[0];

            this.#currentUser = new User({
                id: u.id_utilisateur,
                username: u.courriel,
                nom: u.nom,
                prenom: u.prenom
            });

            return true;
        }

        this.#currentUser = null;
        return false;
    }
}

const service = new AuthService()
export default service
