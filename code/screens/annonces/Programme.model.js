class Programme {
    #id_programme;

    constructor({
            id_programme,
            nom,
            description = null,
            nb_sessions = null
    }) {
            this.#id_programme = id_programme;
            this.nom = nom;
            this.description = description;
            this.nb_sessions = nb_sessions;
    }

    get id_programme() {
            return this.#id_programme;
    }

    toJSON() {
            return {
                    id_programme: this.#id_programme,
                    nom: this.nom,
                    description: this.description,
                    nb_sessions: this.nb_sessions
            };
    }
}

export default Programme;
