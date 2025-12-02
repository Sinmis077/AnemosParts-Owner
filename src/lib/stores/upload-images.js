import { imageService } from '$lib/services/image-service';
import { toast } from 'svelte-sonner';

export function uploadImageMutation() {
    return {
        mutationFn: async (image) => {
            const response = await imageService.upload(image);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Image uploaded successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to upload image\n${error.message}`);
        }
    };
}

export function uploadImagesMutation() {
    return {
        mutationFn: async (images) => {
            const response = await imageService.uploadMultiple(images);
            return response.data;
        },
        onSuccess: (data) => {
            const count = data?.imageUrls?.length || 0;
            toast.success(`${count} image${count !== 1 ? 's' : ''} uploaded successfully!`);
        },
        onError: (error) => {
            toast.error(`Failed to upload images\n${error.message}`);
        }
    };
}