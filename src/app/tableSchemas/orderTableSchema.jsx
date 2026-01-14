import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const statusColors = {
	PAID: "bg-blue-100 text-blue-800",
	PROCESSING: "bg-yellow-100 text-yellow-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-green-100 text-green-800",
	CANCELLED: "bg-red-100 text-red-800",
}

export const orderTableSchema = ({ onEdit, onDelete }) => [
	{
		accessorKey: "id",
		header: "Id",
		cell: ({ row }) => <p className="font-medium text-start ps-3">{row.getValue("id")}</p>,
	},
	{
		accessorKey: "customerEmail",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Customer Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <p className="font-medium text-start ps-3">{row.getValue("customerEmail")}</p>,
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const status = row.getValue("status")
			return (
				<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] ?? "bg-gray-100 text-gray-800"}`}>
          {status}
        </span>
			)
		},
	},
	{
		accessorKey: "address",
		header: "Shipping Address",
		cell: ({ row }) => {
			const address = row.getValue("address")
			if (!address) return <span className="text-muted-foreground">—</span>
			return (
				<div className="text-sm text-start ps-3">
					<p className="font-medium">{address.forename} {address.surname}</p>
					<p>{address.street} {address.houseNumber}{address.extras ? `, ${address.extras}` : ""}</p>
					<p className="text-muted-foreground">{address.postalCode} {address.city}, {address.state}</p>
					<p className="text-muted-foreground">{address.country}</p>
				</div>
			)
		},
	},
	{
		accessorKey: "items",
		header: "Items",
		cell: ({ row }) => {
			const items = row.getValue("items")
			if (!items || items.length === 0) return <span className="text-muted-foreground">—</span>

			const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

			return (
				<p className="font-medium text-start ps-3">
					{items.length} parts ({totalQuantity} total)
				</p>
			)
		},
	},
	{
		accessorKey: "orderDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date of order
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <p className="font-medium text-start ps-3">{new Date(row.getValue("orderDate")).toDateString()}</p>,
	},
	{
		accessorKey: "total",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Total
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <p className="font-medium text-start ps-3">€ {row.getValue("total")}</p>,
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<div className="flex gap-1">
				<Button
					variant="ghost"
					className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
					onClick={() => onEdit(row.original)}
				>
					<SquarePen className="h-4 w-4" />
					<span className="sr-only">Edit</span>
				</Button>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
					onClick={() => onDelete(row.original.id)}
				>
					<Trash2 className="h-4 w-4" />
					<span className="sr-only">Delete</span>
				</Button>
			</div>
		),
	},
]