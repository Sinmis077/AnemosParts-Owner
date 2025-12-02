<script>
	import { SquarePen, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let { row, column, onEdit, onDelete } = $props();
</script>

{#if column.accessorKey === 'actions'}
	<div class="flex gap-1">
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8 text-blue-600 hover:text-blue-700"
			onclick={() => onEdit(row)}
			aria-label="Edit {row.name}"
		>
			<SquarePen class="h-4 w-4" />
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8 text-red-600 hover:text-red-700"
			onclick={() => onDelete(row.id)}
			aria-label="Delete {row.name}"
		>
			<Trash2 class="h-4 w-4" />
		</Button>
	</div>
{:else if column.accessorKey === 'models'}
	{#if row.models && row.models.length > 0}
		<ul class="font-medium text-start ps-3">
			{#each row.models as model}
				<li>{model.name}</li>
			{/each}
		</ul>
	{:else}
		<p class="font-medium text-start ps-3">-</p>
	{/if}
{:else if column.accessorKey === 'price'}
	<p class="font-medium text-start ps-3">${Number(row[column.accessorKey]).toFixed(2)}</p>
{:else if column.cell}
	{@html column.cell(row)}
{:else if column.accessorKey}
	<p class="font-medium text-start ps-3">{row[column.accessorKey]}</p>
{/if}
