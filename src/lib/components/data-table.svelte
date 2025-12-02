<script>
	import { ChevronDown, FilePlus, Search, ArrowUpDown } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import DataTableCell from './data-table-cell.svelte';

	let {
		columns = [],
		data = [],
		filterColumn = 'name',
		showSelected = true,
		onAdd = null,
		addText = '',
		onEdit = () => {},
		onDelete = () => {}
	} = $props();

	// State using Svelte 5 runes
	let filterValue = $state('');
	let sortColumn = $state(null);
	let sortDirection = $state('asc');
	let currentPage = $state(0);
	let pageSize = $state(10);
	let columnVisibility = $state(
		columns.reduce((acc, col) => {
			if (col.accessorKey) acc[col.accessorKey] = true;
			return acc;
		}, {})
	);

	// Computed values
	let filteredData = $derived(() => {
		if (!filterValue) return data;
		return data.filter((row) => {
			const value = row[filterColumn];
			if (value == null) return false;
			return String(value).toLowerCase().includes(filterValue.toLowerCase());
		});
	});

	let sortedData = $derived(() => {
		const filtered = filteredData();
		if (!sortColumn) return filtered;

		return [...filtered].sort((a, b) => {
			const aVal = a[sortColumn];
			const bVal = b[sortColumn];

			if (aVal == null) return 1;
			if (bVal == null) return -1;

			let comparison = 0;
			if (typeof aVal === 'string') {
				comparison = aVal.localeCompare(bVal);
			} else if (typeof aVal === 'number') {
				comparison = aVal - bVal;
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});
	});

	let paginatedData = $derived(() => {
		const sorted = sortedData();
		const start = currentPage * pageSize;
		return sorted.slice(start, start + pageSize);
	});

	let totalPages = $derived(Math.ceil(sortedData().length / pageSize));

	let visibleColumns = $derived(
		columns.filter((col) => !col.accessorKey || columnVisibility[col.accessorKey])
	);

	function toggleSort(column) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function previousPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function setPageSize(value) {
		pageSize = Number(value);
		currentPage = 0;
	}
</script>

<div class="w-full space-y-4">
	<div class="flex items-center justify-between">
		<div class="relative max-w-sm">
			<Search
				class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
			/>
			<Input placeholder="Filter by {filterColumn}..." bind:value={filterValue} class="pl-10" />
		</div>

		<div class="flex items-center gap-2">
			{#if onAdd && addText.length > 0}
				<Button variant="default" onclick={onAdd}>
					<FilePlus />
				</Button>
			{/if}

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>
							Columns <ChevronDown class="ml-2 h-4 w-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each columns.filter((col) => col.accessorKey && col.accessorKey !== 'actions') as column}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							checked={columnVisibility[column.accessorKey]}
							onCheckedChange={(value) => {
								columnVisibility[column.accessorKey] = value;
							}}
						>
							{column.accessorKey}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each visibleColumns as column}
						<Table.Head>
							{#if column.sortable !== false && column.accessorKey}
								<Button
									variant="ghost"
									onclick={() => toggleSort(column.accessorKey)}
									class="flex items-center gap-2"
								>
									{typeof column.header === 'string' ? column.header : column.accessorKey}
									<ArrowUpDown class="h-4 w-4" />
								</Button>
							{:else}
								{typeof column.header === 'string' ? column.header : column.accessorKey || ''}
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if paginatedData().length}
					{#each paginatedData() as row}
						<Table.Row class="hover:bg-muted/50">
							{#each visibleColumns as column}
								<Table.Cell>
									<DataTableCell {row} {column} {onEdit} {onDelete} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={visibleColumns.length} class="h-24 text-center">
							No results.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<p class="text-sm font-medium">Items per page</p>
			<Select.Root
				selected={{ value: `${pageSize}`, label: `${pageSize}` }}
				onSelectedChange={(v) => {
					if (v) setPageSize(v.value);
				}}
			>
				<Select.Trigger class="h-8 w-[70px]">
					<Select.Value placeholder={pageSize} />
				</Select.Trigger>
				<Select.Content side="top">
					{#each [10, 15, 20] as size}
						<Select.Item value={`${size}`}>{size}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		{#if showSelected}
			<div class="text-sm text-muted-foreground">
				Showing {paginatedData().length} of {sortedData().length} row(s).
			</div>
		{/if}

		<div class="flex items-center space-x-2">
			<Button variant="outline" size="sm" onclick={previousPage} disabled={currentPage === 0}>
				Previous
			</Button>
			<div class="text-sm font-medium">
				Page {currentPage + 1} of {totalPages || 1}
			</div>
			<Button
				variant="outline"
				size="sm"
				onclick={nextPage}
				disabled={currentPage >= totalPages - 1}
			>
				Next
			</Button>
		</div>
	</div>
</div>
