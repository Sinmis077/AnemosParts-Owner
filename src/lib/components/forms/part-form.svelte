<script>
  import { createMutation, createQuery } from '@tanstack/svelte-query';
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { Camera, X } from "lucide-svelte";
  import { createPartMutation, updatePartMutation } from "$lib/stores/parts";
  import { modelsQueryOptions } from "$lib/stores/models";
  import { uploadImagesMutation } from "$lib/stores/upload-images";
  import { onMount } from "svelte";

  export let partId = null;
  export let part = null;
  export let onClose = () => {};

  const createPart = createMutation(createPartMutation);
  const updatePart = createMutation(updatePartMutation);
  const uploadImages = createMutation(uploadImagesMutation);
  const models = createQuery(modelsQueryOptions);

  // Form state
  let formData = {
    name: part?.name ?? "",
    description: part?.description ?? "",
    oemNumber: part?.oemNumber ?? "",
    partNumber: part?.partNumber ?? "",
    price: part?.price ?? 0,
    quantity: part?.quantity ?? 0,
    modelIds: part?.modelIds ?? [],
    imageUrls: part?.images ?? [],
  };

  let imagePreviews = part?.imageUrls ?? [];
  let uploadedImageUrls = part?.imageUrls ?? [];
  let modelSearchQuery = "";
  let fileInput;
  let errors = {};
  let isSubmitting = false;

  $: filteredModels =
    modelSearchQuery.length >= 3 && models.data
      ? models.data.models.filter(
          (model) =>
            model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) &&
            !formData.modelIds.includes(model.id)
        )
      : [];

  $: selectedModels =
    models.data && formData.modelIds
      ? models.data.models.filter((model) => formData.modelIds.includes(model.id))
      : [];

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 10 - imagePreviews.length;
    if (files.length > remainingSlots) {
      alert(
        `You can only add ${remainingSlots} more image${remainingSlots !== 1 ? "s" : ""}. Maximum is 10 images.`
      );
      if (fileInput) fileInput.value = "";
      return;
    }

    uploadImages.mutate(files, {
      onSuccess: (data) => {
        const newImageUrls = data.imageUrls || [];
        imagePreviews = [...imagePreviews, ...newImageUrls];
        uploadedImageUrls = [...uploadedImageUrls, ...newImageUrls];
        formData.imageUrls = uploadedImageUrls;
      },
    });

    if (fileInput) fileInput.value = "";
  }

  function removeImage(indexToRemove) {
    imagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    uploadedImageUrls = uploadedImageUrls.filter((_, index) => index !== indexToRemove);
    formData.imageUrls = uploadedImageUrls;
  }

  function addModel(modelId) {
    if (!formData.modelIds.includes(modelId)) {
      formData.modelIds = [...formData.modelIds, modelId];
      modelSearchQuery = "";
    }
  }

  function removeModel(modelId) {
    formData.modelIds = formData.modelIds.filter((id) => id !== modelId);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    errors = {};

    // Basic validation
    if (!formData.name) errors.name = "Name is required";
    if (formData.description.length < 10 || formData.description.length > 500) {
      errors.description = "Description must be between 10 and 500 characters";
    }

    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      return;
    }

    const partData = {
      ...formData,
      imageUrls: uploadedImageUrls,
    };

    if (partId) {
      updatePart.mutate({ id: partId, part: partData });
    } else {
      createPart.mutate(partData);
    }

    isSubmitting = false;
    if (onClose) onClose();
  }

  onMount(() => {
    if (part) {
      if (part.models) {
        part.models.forEach((model) => {
          if (!formData.modelIds.includes(model.id)) {
            formData.modelIds = [...formData.modelIds, model.id];
          }
        });
      }

      if (part.images) {
        const imageListUrls = part.images.map((image) => image.source);
        uploadedImageUrls = imageListUrls;
        imagePreviews = imageListUrls;
        formData.imageUrls = imageListUrls;
      }
    }
  });
</script>

<form on:submit={handleSubmit} class="space-y-6">
  <div class="text-lg font-semibold">
    {part == null ? "Add new part" : "Edit part"}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
    <!-- Images Section -->
    <div class="order-2 lg:order-1">
      <div class="space-y-3">
        <Label for="images">Images</Label>
        
        <input
          bind:this={fileInput}
          id="images"
          type="file"
          multiple
          accept="image/*"
          on:change={handleImageChange}
          class="hidden"
          disabled={uploadImages.isPending}
        />

        <Button
          type="button"
          variant="outline"
          on:click={() => fileInput?.click()}
          disabled={uploadImages.isPending || imagePreviews.length >= 10}
          class="w-full"
        >
          <Camera class="mr-2 h-4 w-4" />
          {uploadImages.isPending
            ? "Uploading..."
            : imagePreviews.length >= 10
              ? "Maximum 10 images reached"
              : "Add Images"}
        </Button>

        {#if imagePreviews.length > 0}
          <div class="grid grid-cols-2 gap-2">
            {#each imagePreviews as imageUrl, index}
              <div class="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden group">
                <img src={imageUrl} alt="Part image {index + 1}" class="h-full w-full object-cover" />
                <button
                  type="button"
                  on:click={() => removeImage(index)}
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X class="h-3 w-3" />
                </button>
              </div>
            {/each}
          </div>
        {/if}

        <p class="text-sm text-muted-foreground">
          {uploadImages.isPending
            ? "Uploading images..."
            : "Upload one or multiple images for this part"}
        </p>
      </div>
    </div>

    <!-- Form Fields Section -->
    <div class="order-1 lg:order-2 space-y-4">
      <!-- Name -->
      <div class="space-y-2">
        <Label for="name">Name</Label>
        <Input
          id="name"
          bind:value={formData.name}
          placeholder="Enter part name"
          autocomplete="off"
        />
        {#if errors.name}
          <p class="text-sm text-red-600">{errors.name}</p>
        {/if}
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          bind:value={formData.description}
          placeholder="Enter part description (10-500 characters)"
          class="min-h-[100px]"
        />
        {#if errors.description}
          <p class="text-sm text-red-600">{errors.description}</p>
        {/if}
      </div>

      <!-- OEM Number -->
      <div class="space-y-2">
        <Label for="oemNumber">OEM Number</Label>
        <Input
          id="oemNumber"
          bind:value={formData.oemNumber}
          placeholder="Enter OEM number"
        />
      </div>

      <!-- Part Number -->
      <div class="space-y-2">
        <Label for="partNumber">Part Number</Label>
        <Input
          id="partNumber"
          bind:value={formData.partNumber}
          placeholder="Enter part number"
        />
      </div>

      <!-- Price -->
      <div class="space-y-2">
        <Label for="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          bind:value={formData.price}
          placeholder="0.00"
        />
      </div>

      <!-- Quantity -->
      <div class="space-y-2">
        <Label for="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          bind:value={formData.quantity}
          placeholder="0"
        />
      </div>

      <!-- Models -->
      <div class="space-y-2">
        <Label for="modelSearch">Models</Label>
        {#if models.isLoading}
          <div class="h-32 w-full bg-muted animate-pulse rounded" />
        {:else if models.error}
          <div>
            <p>Failed to load models</p>
            <p class="text-red-600">{models.error.message}</p>
          </div>
        {:else}
          <div class="space-y-2">
            {#if selectedModels.length > 0}
              <div class="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                {#each selectedModels as model}
                  <div class="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <span>{model.name}</span>
                    <button
                      type="button"
                      on:click={() => removeModel(model.id)}
                      class="hover:bg-blue-200 rounded-full p-0.5"
                      aria-label="Remove {model.name}"
                    >
                      <X class="h-3 w-3" />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}

            <div class="relative">
              <Input
                id="modelSearch"
                type="text"
                bind:value={modelSearchQuery}
                placeholder="Type at least 3 characters to search models..."
                autocomplete="off"
              />

              {#if modelSearchQuery.length >= 3 && filteredModels.length > 0}
                <div class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {#each filteredModels as model}
                    <button
                      type="button"
                      on:click={() => addModel(model.id)}
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {model.name}
                    </button>
                  {/each}
                </div>
              {/if}

              {#if modelSearchQuery.length >= 3 && filteredModels.length === 0}
                <div class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-sm text-gray-500">
                  No models found matching "{modelSearchQuery}"
                </div>
              {/if}
            </div>

            <p class="text-sm text-muted-foreground">
              {modelSearchQuery.length < 3
                ? "Type at least 3 characters to search and select models"
                : `Found ${filteredModels.length} model${filteredModels.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <Button type="submit" disabled={isSubmitting} class="px-4 py-2">
    {isSubmitting ? "Saving..." : "Save Part"}
  </Button>
</form>