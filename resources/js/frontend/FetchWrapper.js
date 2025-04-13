class FetchWrapper {
    constructor(baseUrl, nonce) {
        this.baseUrl = baseUrl;
        this.nonce = nonce; // Store the nonce for authentication
    }

    async request(url, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': this.nonce // Add nonce to every request
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${url}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    }

    get(url) {
        return this.request(url, 'GET');
    }

    post(url, data) {
        return this.request(url, 'POST', data);
    }

    put(url, data) {
        return this.request(url, 'PUT', data);
    }

    delete(url) {
        return this.request(url, 'DELETE');
    }
}

export default FetchWrapper;