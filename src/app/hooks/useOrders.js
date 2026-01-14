import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatError } from '@/app/utils/errorformatter.js';
import { ordersService } from '@/app/services/ordersService.js';

export const useOrders = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['orders'],
		queryFn: async () => {
			const response = await ordersService.findAll()
			return response.data;
		},
		staleTime: 5 * 60 * 1000,
		refetchInterval: 10 * 60 * 1000
	})

	return {
		orders: data ? data.orders : [],
		isLoading,
		error: formatError(error),
	}
}

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (request) => {
			const response = await ordersService.updateStatus(request)
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			toast.success("Order status updated successfully!")
		},
		onError: (error) => {
			toast.error(`Failed to update order status \n\r${formatError(error)}`);
		}
	})
}

export const useShipOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (request) => {
			const response = await ordersService.ship(request)
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			toast.success("Tracking code added successfully!")
		},
		onError: (error) => {
			toast.error(`Failed to add tracking code \n\r${formatError(error)}`);
		}
	})
}

export const useCancelOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (orderId) => {
			const response = await ordersService.cancel(orderId)
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			toast.success("Order cancelled successfully!")
		},
		onError: (error) => {
			toast.error(`Failed to cancel order \n\r${formatError(error)}`);
		}
	})
}