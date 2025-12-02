<script>
  import { createQuery, createMutation } from '@tanstack/svelte-query';
  import { fullPartsQueryOptions, deletePartMutation } from "$lib/stores/parts";
  import { partTableSchema } from "$lib/tables/part-table-schema";
  import DataTable from "$lib/components/data-table.svelte";
  import DeleteModal from "$lib/components/delete-modal.svelte";
  import EditModal from "$lib/components/edit-modal.svelte";
  import PartForm from "$lib/components/forms/part-form.svelte";

  // Don't use $ prefix - access properties directly
  const parts = createQuery(fullPartsQueryOptions);
  const deletePart = createMutation(deletePartMutation);

  let isDeleteModalOpen = $state(false);
  let isEditModalOpen = $state(false);
  let selectedPartId = $state(0);
  let selectedPart = $state({});

  function openDeleteModal(id) {
    selectedPartId = id;
    isDeleteModalOpen = true;
  }

  function closeDeleteModal() {
    isDeleteModalOpen = false;
  }

  function confirmDeletePart(id) {
    if (id) {
      deletePart.mutate(id);
      closeDeleteModal();
    }
  }

  function openEditModal(object) {
    selectedPart = object;
    isEditModalOpen = true;
  }

  function closeEditModal() {
    isEditModalOpen = false;
  }
</script>

<svelte:head>
  <title>Parts Warehouse</title>
</svelte:head>

{#if parts.isLoading}
  <div class="flex items-center justify-center p-10">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span class="ml-2">Loading...</span>
  </div>
{:else if parts.error}
  <div class="p-10">
    <p>An error has occurred</p>
    <p class="text-red-600">{parts.error.message}</p>
  </div>
{:else}
  <main class="flex w-full justify-center p-10">
    <DataTable
      columns={partTableSchema()}
      data={parts.data?.parts || []}
      filterColumn="name"
      showSelected={false}
      onEdit={openEditModal}
      onDelete={openDeleteModal}
    />
  </main>

  <DeleteModal
    open={isDeleteModalOpen}
    onClose={closeDeleteModal}
    onConfirm={confirmDeletePart}
    objectId={selectedPartId}
  />

  <EditModal
    open={isEditModalOpen}
    onClose={closeEditModal}
    className="sm:max-w-[880px] max-h-[90vh] flex flex-col"
  >
    <PartForm partId={selectedPart.id} part={selectedPart} onClose={closeEditModal} />
  </EditModal>
{/if}