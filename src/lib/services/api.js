import { env } from '$env/dynamic/public';

const API_URL = env.PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchAPI(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),
    
    post: (endpoint, data) => fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    put: (endpoint, data) => fetchAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' }),
};