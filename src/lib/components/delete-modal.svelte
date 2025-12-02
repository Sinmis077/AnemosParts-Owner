<script>
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";

  export let open = false;
  export let onClose = () => {};
  export let onConfirm = () => {};
  export let objectId = null;
</script>

<Dialog.Root {open} onOpenChange={onClose}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Confirm deletion</Dialog.Title>
      <Dialog.Description>This cannot be undone!</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" on:click={onClose}>Cancel</Button>
      <Button
        variant="destructive"
        on:click={() => {
          onConfirm(objectId);
          onClose();
        }}
      >
        Delete
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>