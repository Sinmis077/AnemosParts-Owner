import { env } from '$env/dynamic/public';

const API_URL = env.PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchImageAPI(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const imageApi = {
    post: (endpoint, formData) => fetchImageAPI(endpoint, {
        method: 'POST',
        body: formData, // FormData sets its own Content-Type with boundary
    }),
};