export const partTableSchema = () => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "oemNumber",
        header: "OEM Number",
    },
    {
        accessorKey: "partNumber",
        header: "Part Number",
        sortable: false,
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "models",
        header: "Models",
        sortable: false,
    },
    {
        accessorKey: "actions",
        header: "Actions",
        sortable: false,
    },
];