import { api } from './api';

export const partService = {
    findAll: async () => {
        const data = await api.get('/parts');
        return { data };
    },

    findAllFull: async () => {
        const data = await api.get('/parts/full');
        return { data };
    },

    create: async (part) => {
        const data = await api.post('/parts', part);
        return { data };
    },

    update: async (id, part) => {
        const data = await api.put(`/parts/${id}`, part);
        return { data };
    },
    
    delete: async (id) => {
        const data = await api.delete(`/parts/${id}`);
        return { data };
    }
};