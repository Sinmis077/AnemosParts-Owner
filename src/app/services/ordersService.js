import { api } from "./api";

export const ordersService = {
	findAll: () => api.get('/orders'),

	updateStatus: (request) => api.put('/orders', request),

	ship: (request) => api.put('/orders/ship', request),

	cancel: (orderId) => api.delete('/orders', { params: { orderId } }),
}