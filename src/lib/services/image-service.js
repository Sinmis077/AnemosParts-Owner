import { imageApi } from './image-api';

export const imageService = {
    upload: async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        const data = await imageApi.post('/images', formData);
        return { data };
    },

    uploadMultiple: async (images) => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });

        const data = await imageApi.post('/images/batch', formData);
        return { data };
    }
};