class Proposition {
  constructor(data = {}) {
    this.id_proposition = data.id_proposition ?? null;
    this.id_annonce = data.id_annonce ?? null;
    this.id_statut = data.id_statut ?? null;
    this.statut_description = data.statut_description ?? "";
    this.titre_annonce = data.titre_annonce ?? "";
    this.acheteur_prenom = data.acheteur_prenom ?? "";
    this.acheteur_nom = data.acheteur_nom ?? "";
    this.prix = data.prix ?? "";
    this.lieu = data.lieu ?? "";
    this.date_proposition = data.date_proposition ?? null;
    this.autres = { ...data };
  }

  static fromApi(data) {
    return new Proposition(data);
  }

  cloneWith(updates = {}) {
    return new Proposition({ ...this.toJSON(), ...updates });
  }

  toJSON() {
    return {
      id_proposition: this.id_proposition,
      id_annonce: this.id_annonce,
      id_statut: this.id_statut,
      statut_description: this.statut_description,
      titre_annonce: this.titre_annonce,
      acheteur_prenom: this.acheteur_prenom,
      acheteur_nom: this.acheteur_nom,
      prix: this.prix,
      lieu: this.lieu,
      date_proposition: this.date_proposition,
      ...this.autres,
    };
  }

  get buyerFullName() {
    return `${this.acheteur_prenom} ${this.acheteur_nom}`.trim();
  }

  get formattedPrice() {
    const value = Number(this.prix);
    if (Number.isFinite(value)) {
      try {
        return new Intl.NumberFormat('fr-CA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      } catch {
        return value.toFixed(2);
      }
    }
    return String(this.prix ?? "");
  }

  get formattedDate() {
    if (!this.date_proposition) {
      return "";
    }
    const date = new Date(this.date_proposition);
    return Number.isNaN(date.getTime()) ? String(this.date_proposition) : date.toLocaleDateString();
  }

  get isPending() {
    const statut = (this.statut_description || "").toLowerCase();
    return this.id_statut === 1 || statut.includes("attente");
  }
}

export default Proposition;
