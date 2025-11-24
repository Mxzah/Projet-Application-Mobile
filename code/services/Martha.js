class MarthaService {

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
}

export default MarthaService;