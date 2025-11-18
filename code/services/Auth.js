import User from '../models/User'

class AuthService {
    #currentUser = null // ATTENTION, à utiliser judicieusement

    get currentUser() {
        return this.#currentUser
    }

    async signUp(credentials) {
        // credentials doit contenir : nom, prenom, courriel, mot_de_passe
        const response = await fetch("http://martha.jh.shawinigan.info/queries/insert-user/execute", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'auth': 'dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==',
                'Content-Type': 'application/json'
            }
        }).then((r) => r.json())

        if (response.success) {
            // on utilise le courriel comme "username" affichable
            this.#currentUser = new User({
                id: response.lastInsertId,
                username: credentials.courriel,
                // si ton modèle User accepte plus de props :
                nom: credentials.nom,
                prenom: credentials.prenom
            })
        }

        return !!this.#currentUser
    }

    async logIn(credentials) {
        // credentials doit contenir : courriel, mot_de_passe
        const response = await fetch("http://martha.jh.shawinigan.info/queries/select-user-auth/execute", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'auth': 'dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==',
                'Content-Type': 'application/json'
            }
        }).then((r) => r.json())

        if (response.success && response.data.length === 1) {
            const user = response.data[0]

            this.#currentUser = new User({
                id: user.id_utilisateur,          // colonne de ta table
                username: user.courriel,          // ce qu’on affiche dans l’app
                // si disponible et utile :
                nom: user.nom,
                prenom: user.prenom
            })

            console.log(JSON.stringify(this.#currentUser))
        } else {
            this.#currentUser = null
        }

        return !!this.#currentUser
    }

    // ...
}

const service = new AuthService()
export default service
