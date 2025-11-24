class Cours {
    #id_cours;

    constructor({
            id_cours,
            code,
            nom,
            description = null,
            id_programme = null
    }) {
            this.#id_cours = id_cours;
            this.code = code;
            this.nom = nom;
            this.description = description;
            this.id_programme = id_programme;
    }

    get id_cours() {
            return this.#id_cours;
    }

    toJSON() {
            return {
                    id_cours: this.#id_cours,
                    code: this.code,
                    nom: this.nom,
                    description: this.description,
                    id_programme: this.id_programme
            };
    }
}

export default Cours;
