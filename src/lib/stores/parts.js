import { useQueryClient } from '@tanstack/svelte-query';
import { partService } from '$lib/services/part-service';
import { toast } from 'svelte-sonner';

// Export functions that return query options
export function partsQueryOptions() {
    return {
        queryKey: ['parts'],
        queryFn: async () => {
            const response = await partService.findAll();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000
    };
}

export function fullPartsQueryOptions() {
    return {
        queryKey: ['fullParts'],
        queryFn: async () => {
            const response = await partService.findAllFull();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000
    };
}

export function createPartMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async (part) => {
            const response = await partService.create(part);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts', 'fullParts'] });
            toast.success('Part added successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to make part\n${error.message}`);
        }
    };
}

export function updatePartMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async ({ id, part }) => {
            const response = await partService.update(id, part);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts', 'fullParts'] });
            toast.success('Part updated successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to update part\n${error.message}`);
        }
    };
}

export function deletePartMutation() {
    const queryClient = useQueryClient();

    return {
        mutationFn: async (id) => {
            const response = await partService.delete(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts', 'fullParts'] });
            toast.success('Part deleted successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to delete part\n${error.message}`);
        }
    };
}