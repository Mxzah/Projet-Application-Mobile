class User {
    #id;
    constructor({ id, username }) {
        this.#id = id
        this.username = username
    }
    get id() { return this.#id }
    toJSON() { return { id: this.#id, username: this.username } }
}
export default User
