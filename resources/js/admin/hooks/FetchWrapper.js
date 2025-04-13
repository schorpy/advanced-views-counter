class FetchWrapper {
    constructor(baseUrl, nonce) {
        this.baseUrl = baseUrl;
        this.nonce = nonce; // Store the nonce for authentication
    }

    async request(url, method = 'GET', data = null, customHeaders = {}) {
        const options = {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': customHeaders['Content-Type'] || 'application/json',
                'X-WP-Nonce': this.nonce
            },
            ...customHeaders
        };

        if (data) {
            options.body = customHeaders['Content-Type']?.includes('json') 
                ? JSON.stringify(data)
                : data;
        }

        const response = await fetch(`${this.baseUrl}${url}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    }

    get(url, customHeaders = {}) {
        return this.request(url, 'GET', null, customHeaders);
    }

    post(url, data, customHeaders = {}) {
        return this.request(url, 'POST', data, customHeaders);
    }

    put(url, data, customHeaders = {}) {
        return this.request(url, 'PUT', data, customHeaders);
    }

    delete(url, customHeaders = {}) {
        return this.request(url, 'DELETE', null, customHeaders);
    }
}

export default FetchWrapper;