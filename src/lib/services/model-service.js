import { api } from './api';

export const modelService = {
    findAll: async () => {
        const data = await api.get('/models');
        return { data };
    },

    create: async (model) => {
        const data = await api.post('/models', model);
        return { data };
    },

    update: async (id, model) => {
        const data = await api.put(`/models/${id}`, model);
        return { data };
    },

    delete: async (id) => {
        const data = await api.delete(`/models/${id}`);
        return { data };
    }
};