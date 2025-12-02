import { useQueryClient } from '@tanstack/svelte-query';
import { modelService } from '$lib/services/model-service';
import { toast } from 'svelte-sonner';

export function modelsQueryOptions() {
    return {
        queryKey: ['models'],
        queryFn: async () => {
            const response = await modelService.findAll();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000
    };
}

export function createModelMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async (model) => {
            const response = await modelService.create(model);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['models'] });
            toast.success('Model added successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to make model\n${error.message}`);
        }
    };
}

export function updateModelMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async ({ id, model }) => {
            const response = await modelService.update(id, model);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['models'] });
            toast.success('Model updated successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to update model\n${error.message}`);
        }
    };
}

export function deleteModelMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async (id) => {
            const response = await modelService.delete(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['models'] });
            toast.success('Model deleted successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to delete model\n${error.message}`);
        }
    };
}