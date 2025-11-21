class User {
        #id;

        constructor({ id, username, nom = null, prenom = null }) {
                this.#id = id;
                this.username = username;   // = ton courriel
                this.nom = nom;
                this.prenom = prenom;
        }

        get id() {
                return this.#id;
        }

        toJSON() {
                return {
                        id: this.#id,
                        username: this.username,
                        nom: this.nom,
                        prenom: this.prenom,
                };
        }
}

export default User;
