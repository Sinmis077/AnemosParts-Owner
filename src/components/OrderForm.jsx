import { useForm } from "react-hook-form";
import { useUpdateOrderStatus, useShipOrder, useCancelOrder } from "@/app/hooks/useOrders";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { updateOrderStatusSchema, shipOrderSchema, ORDER_STATUSES } from "@/app/schemas/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export function OrderForm({ order, onClose }) {
	const [mode, setMode] = useState("status"); // "status" or "ship"

	const updateOrderStatus = useUpdateOrderStatus();
	const shipOrder = useShipOrder();
	const cancelOrder = useCancelOrder();

	const statusForm = useForm({
		resolver: zodResolver(updateOrderStatusSchema),
		defaultValues: {
			orderId: order?.id ?? 0,
			status: order?.status ?? "PAID",
		},
	});

	const shipForm = useForm({
		resolver: zodResolver(shipOrderSchema),
		defaultValues: {
			orderId: order?.id ?? 0,
			trackingCode: "",
		},
	});

	const onSubmitStatus = async (data) => {
		await updateOrderStatus.mutateAsync(data);

		if (onClose) {
			onClose();
		}
	};

	const onSubmitShip = async (data) => {
		await shipOrder.mutateAsync(data);

		if (onClose) {
			onClose();
		}
	};

	const onCancel = async () => {
		if (order?.id) {
			await cancelOrder.mutateAsync(order.id);

			if (onClose) {
				onClose();
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Mode Toggle */}
			<div className="flex gap-2">
				<Button
					type="button"
					variant={mode === "status" ? "default" : "outline"}
					onClick={() => setMode("status")}
				>
					Update Status
				</Button>
				<Button
					type="button"
					variant={mode === "ship" ? "default" : "outline"}
					onClick={() => setMode("ship")}
				>
					Add Tracking
				</Button>
			</div>

			{mode === "status" ? (
				<form onSubmit={statusForm.handleSubmit(onSubmitStatus)} className="space-y-6">
					<FieldSet>
						<FieldLegend>Update Order Status</FieldLegend>

						<FieldGroup>
							{/* Order ID (hidden/readonly) */}
							<input type="hidden" {...statusForm.register("orderId", { valueAsNumber: true })} />

							{/* Status Select */}
							<Field>
								<FieldLabel htmlFor="status">Status</FieldLabel>
								<select
									id="status"
									{...statusForm.register("status")}
									aria-invalid={!!statusForm.formState.errors.status}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									{ORDER_STATUSES.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
								{statusForm.formState.errors.status && (
									<FieldError>{statusForm.formState.errors.status.message}</FieldError>
								)}
							</Field>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={statusForm.formState.isSubmitting}
								className="px-4 py-2 hover:pointer disabled:opacity-50"
							>
								{statusForm.formState.isSubmitting ? "Saving..." : "Update Status"}
							</Button>
						</FieldGroup>
					</FieldSet>
				</form>
			) : (
				<form onSubmit={shipForm.handleSubmit(onSubmitShip)} className="space-y-6">
					<FieldSet>
						<FieldLegend>Ship Order</FieldLegend>

						<FieldGroup>
							{/* Order ID (hidden) */}
							<input type="hidden" {...shipForm.register("orderId", { valueAsNumber: true })} />

							{/* Tracking Code Field */}
							<Field>
								<FieldLabel htmlFor="trackingCode">Tracking Code</FieldLabel>
								<Input
									id="trackingCode"
									{...shipForm.register("trackingCode")}
									aria-invalid={!!shipForm.formState.errors.trackingCode}
									placeholder="Enter tracking code"
									autoComplete="off"
								/>
								{shipForm.formState.errors.trackingCode && (
									<FieldError>{shipForm.formState.errors.trackingCode.message}</FieldError>
								)}
							</Field>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={shipForm.formState.isSubmitting}
								className="px-4 py-2 hover:pointer disabled:opacity-50"
							>
								{shipForm.formState.isSubmitting ? "Saving..." : "Add Tracking Code"}
							</Button>
						</FieldGroup>
					</FieldSet>
				</form>
			)}

			{/* Cancel Order Button */}
			<div className="border-t pt-4">
				<Button
					type="button"
					variant="destructive"
					onClick={onCancel}
					disabled={cancelOrder.isPending}
					className="px-4 py-2"
				>
					{cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
				</Button>
			</div>
		</div>
	);
}