import { z } from "zod";

export const ORDER_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export const updateOrderStatusSchema = z.object({
	orderId: z.number().positive("Order ID must be positive"),
	status: z.enum(ORDER_STATUSES, {
		required_error: "Status is required",
	}),
});

export const shipOrderSchema = z.object({
	orderId: z.number().positive("Order ID must be positive"),
	trackingCode: z.string().min(1, "Tracking code is required"),
});