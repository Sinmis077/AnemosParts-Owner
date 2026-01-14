import { DataTable } from '@/components/DataTable.jsx';
import { orderTableSchema } from '@/app/tableSchemas/orderTableSchema.jsx';
import { DeleteModal } from '@/components/DeleteModal.jsx';
import { EditModal } from '@/components/EditModal.jsx';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner.jsx';
import { useCancelOrder, useOrders } from '@/app/hooks/useOrders.js';
import { OrderForm } from '@/components/OrderForm.jsx';
import { CancelModal } from '@/components/CancelModal.jsx';

export function OrdersPage() {
	const Orders = useOrders();
	const CancelOrder = useCancelOrder();

	console.log(Orders);

	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setEditModalOpen] = useState(false);

	const [selectedModelId, setSelectedModelId] = useState(0)
	const [selectedOrder, setSelectedOrder] = useState({})

	const openDeleteModal = (id) => {
		setSelectedModelId(id)

		setDeleteModalOpen(true)
	}

	const closeDeleteModal = () => {
		setDeleteModalOpen(false)
	}
	const confirmDeleteModel = (id) => {
		if (id) {
			CancelOrder.mutate(id)
		}
	}

	const openEditModal = (object) => {
		setSelectedOrder(object)

		setEditModalOpen(true)
	}

	const closeEditModal = () => {
		setEditModalOpen(false)
	}

	if (Orders.isLoading) {
		return (
			<>
				<Spinner /> Loading
			</>
		)
	}

	if (Orders.error) {
		return (
			<>
				<p>An error has occurred</p>
				<p className="text-red-600">{Orders.error}</p>
			</>
		)
	}

	return (
		<main className="flex w-full justify-center p-10">
			<DataTable
				columns={orderTableSchema({ onEdit: openEditModal, onDelete: openDeleteModal })}
				data={Orders.orders}
				filterColumn="id"
				showSelected={false}
			/>

			<CancelModal modalOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDeleteModel} objectId={selectedModelId} objectName="order" />
			<EditModal modalOpen={isEditModalOpen} onClose={closeEditModal} Form={<OrderForm order={selectedOrder} onClose={closeEditModal} />} />
		</main>
	)
}