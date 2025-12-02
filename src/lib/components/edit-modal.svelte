<script>
  import * as Dialog from "$lib/components/ui/dialog";

  export let open = false;
  export let onClose = () => {};
  export let className = "sm:max-w-[425px] max-h-[90vh] flex flex-col";
</script>

<Dialog.Root {open} onOpenChange={onClose}>
  <Dialog.Content class={className}>
    <Dialog.Header class="hidden">
      <Dialog.Title>Edit modal</Dialog.Title>
      <Dialog.Description>A form to edit an object</Dialog.Description>
    </Dialog.Header>
    <div class="overflow-y-auto flex-1">
      <slot />
    </div>
  </Dialog.Content>
</Dialog.Root>