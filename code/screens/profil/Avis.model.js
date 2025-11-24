class Avis {
    constructor({
        id_avis,
        note,
        commentaire,
        date_avis,
        id_utilisateur,
        id_noteur,
        id_proposition
    }) {
        this.id = id_avis;
        this.note = note;
        this.commentaire = commentaire;
        this.dateAvis = new Date(date_avis);
        this.idUtilisateur = id_utilisateur; // celui qui reçoit
        this.idNoteur = id_noteur;           // celui qui donne
        this.idProposition = id_proposition;
    }

    get stars() {
        return "★".repeat(this.note) + "☆".repeat(5 - this.note);
    }

    get dateTexte() {
        return this.dateAvis.toLocaleDateString();
    }

    toJSON() {
        return {
            id_avis: this.id,
            note: this.note,
            commentaire: this.commentaire,
            date_avis: this.dateAvis.toISOString(),
            id_utilisateur: this.idUtilisateur,
            id_noteur: this.idNoteur,
            id_proposition: this.idProposition
        };
    }
}

export default Avis;
