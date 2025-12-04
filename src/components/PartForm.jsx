import React from "react";
import {useForm} from "react-hook-form";
import {useCreatePart, useUpdatePart} from "@/app/hooks/useParts";
import {useUploadImages} from "@/app/hooks/useUploadImage";
import {Input} from "@/components/ui/input";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {partSchema} from "@/app/schemas/part";
import {zodResolver} from "@hookform/resolvers/zod";
import {useModels} from "@/app/hooks/useModels";
import {Textarea} from "@/components/ui/textarea";
import {useState, useRef, useMemo, useEffect} from "react";
import {Camera, X} from "lucide-react";

PartForm.propTypes = {
    part: Object,
    onClose: Function,
}

export function PartForm({part, onClose}) {
    const createPart = useCreatePart();
    const updatePart = useUpdatePart();
    const uploadImages = useUploadImages();
    const fileInputRef = useRef(null);

    const {
        models,
        isLoading: isLoadingModels,
        error: loadingModelsError,
    } = useModels();

    const [modelSearchQuery, setModelSearchQuery] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(partSchema),
        defaultValues: {
            name: part?.name ?? "",
            description: part?.description ?? "",
            oemNumber: part?.oemNumber ?? "",
            partNumber: part?.partNumber ?? "",
            price: part?.price ?? 0.25,
            quantity: part?.quantity ?? 1,
            modelIds: part?.modelIds ?? [],
            images: part?.images ?? [],
        },
    });

    const images = watch("images");
    const selectedModelIds = watch("modelIds");

    const imagePreviews = useMemo(
        () => (images || []).map((img) => img.source),
        [images]
    );

    const filteredModels = useMemo(() => {
        if (!models || modelSearchQuery.length < 3) return [];
        const query = modelSearchQuery.toLowerCase();
        return models.filter(
            (model) =>
                model.name.toLowerCase().includes(query) &&
                !selectedModelIds?.includes(model.id)
        );
    }, [models, modelSearchQuery, selectedModelIds]);

    const selectedModels = useMemo(() => {
        if (!models || !selectedModelIds) return [];
        return models.filter((model) => selectedModelIds.includes(model.id));
    }, [models, selectedModelIds]);

    useEffect(() => {
        if (!part) return;

        if (part.models) {
            setValue("modelIds", part.models.map((m) => m.id));
        }
        if (part.images) {
            setValue(
                "images",
                part.images.map((img) => ({
                    id: Number.parseFloat(img.id),
                    source: img.source,
                    isThumbnail: img.isThumbnail ?? false,
                }))
            );
        }
    }, [part, setValue]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = 10 - imagePreviews.length;
        if (files.length > remainingSlots) {
            alert(`You can only add ${remainingSlots} more image${remainingSlots !== 1 ? "s" : ""}.`);
            fileInputRef.current.value = "";
            return;
        }

        uploadImages.mutate(files, {
            onSuccess: (data) => {
                const currentImages = images || [];
                const newImages = (data.imageUrls || []).map((url, i) => ({
                    source: url,
                    isThumbnail: currentImages.length === 0 && i === 0,
                }));
                setValue("images", [...currentImages, ...newImages]);
            },
        });

        fileInputRef.current.value = "";
    };

    const onSubmit = async (data) => {
        if (part.id) {
            updatePart.mutate({id: part.id, part: data});
        } else {
            createPart.mutate(data);
        }
        onClose?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
                <FieldLegend>{part ? "Edit part" : "Add new part"}</FieldLegend>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    <div className="order-2 lg:order-1">
                        <Field>
                            <FieldLabel htmlFor="images">Images</FieldLabel>
                            <div className="space-y-3">
                                <Input
                                    ref={fileInputRef}
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={uploadImages.isPending}
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadImages.isPending || imagePreviews.length >= 10}
                                    className="w-full"
                                >
                                    <Camera className="mr-2 h-4 w-4"/>
                                    {uploadImages.isPending
                                        ? "Uploading..."
                                        : imagePreviews.length >= 10
                                            ? "Maximum 10 images reached"
                                            : "Add Images"}
                                </Button>

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`relative aspect-square rounded-lg overflow-hidden group ${image.isThumbnail || (index === 0 && !images.some((img) => img.isThumbnail))
                                                    ? "border-4 border-sky-600"
                                                    : "border-2 border-gray-200"
                                                }`}
                                            >
                                                <img
                                                    src={image.source}
                                                    alt={`Part image ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <input
                                                    type="checkbox"
                                                    checked={image.isThumbnail || (index === 0 && !images.some((img) => img.isThumbnail))}
                                                    onChange={() => {
                                                        setValue(
                                                            "images",
                                                            images.map((img, i) => ({
                                                                ...img,
                                                                isThumbnail: i === index,
                                                            }))
                                                        );
                                                    }}
                                                    className="absolute top-2 left-2 h-5 w-5 accent-sky-600 cursor-pointer"
                                                    aria-label="Set as thumbnail"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setValue("images", images.filter((_, i) => i !== index))
                                                    }
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    aria-label="Remove image"
                                                >
                                                    <X className="h-3 w-3"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <FieldDescription>
                                    {uploadImages.isPending
                                        ? "Uploading images..."
                                        : "Upload one or multiple images for this part"}
                                </FieldDescription>
                            </div>
                            {errors.images && <FieldError>{errors.images.message}</FieldError>}
                        </Field>
                    </div>

                    <FieldGroup className="order-1 lg:order-2">
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                {...register("name")}
                                aria-invalid={!!errors.name}
                                placeholder="Enter part name"
                                autoComplete="off"
                            />
                            {errors.name && <FieldError>{errors.name.message}</FieldError>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                {...register("description")}
                                aria-invalid={!!errors.description}
                                placeholder="Enter part description (10-500 characters)"
                                className="min-h-[100px] w-full rounded-md border px-3 py-2"
                            />
                            {errors.description && (
                                <FieldError>{errors.description.message}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="oemNumber">OEM Number</FieldLabel>
                            <Input
                                id="oemNumber"
                                {...register("oemNumber")}
                                aria-invalid={!!errors.oemNumber}
                                placeholder="Enter OEM number"
                            />
                            {errors.oemNumber && (
                                <FieldError>{errors.oemNumber.message}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="partNumber">Part Number</FieldLabel>
                            <Input
                                id="partNumber"
                                {...register("partNumber")}
                                aria-invalid={!!errors.partNumber}
                                placeholder="Enter part number"
                            />
                            {errors.partNumber && (
                                <FieldError>{errors.partNumber.message}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="price">Price</FieldLabel>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.25"
                                max="1000"
                                {...register("price", {valueAsNumber: true})}
                                aria-invalid={!!errors.price}
                                placeholder="0.25"
                            />
                            {errors.price && <FieldError>{errors.price.message}</FieldError>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max="100"
                                {...register("quantity", {valueAsNumber: true})}
                                aria-invalid={!!errors.quantity}
                                placeholder="1"
                            />
                            {errors.quantity && (
                                <FieldError>{errors.quantity.message}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="modelSearch">Models</FieldLabel>
                            {isLoadingModels ? (
                                <Skeleton className="h-32 w-full"/>
                            ) : loadingModelsError ? (
                                <div>
                                    <p>Failed to load models</p>
                                    <p className="text-red-600">{loadingModelsError.message}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedModels.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                                            {selectedModels.map((model) => (
                                                <div
                                                    key={model.id}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    <span>{model.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setValue("modelIds", selectedModelIds.filter((id) => id !== model.id))
                                                        }
                                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                                        aria-label={`Remove ${model.name}`}
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="relative">
                                        <Input
                                            id="modelSearch"
                                            type="text"
                                            value={modelSearchQuery}
                                            onChange={(e) => setModelSearchQuery(e.target.value)}
                                            placeholder="Type at least 3 characters to search models..."
                                            className="w-full"
                                            autoComplete="off"
                                        />

                                        {modelSearchQuery.length >= 3 && filteredModels.length > 0 && (
                                            <div
                                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                {filteredModels.map((model) => (
                                                    <button
                                                        key={model.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setValue("modelIds", [...(selectedModelIds || []), model.id]);
                                                            setModelSearchQuery("");
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    >
                                                        {model.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {modelSearchQuery.length >= 3 && filteredModels.length === 0 && (
                                            <div
                                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-sm text-gray-500">
                                                No models found matching &quot;{modelSearchQuery}&quot;
                                            </div>
                                        )}
                                    </div>

                                    <FieldDescription>
                                        {modelSearchQuery.length < 3
                                            ? "Type at least 3 characters to search and select models"
                                            : `Found ${filteredModels.length} model${filteredModels.length !== 1 ? "s" : ""}`}
                                    </FieldDescription>
                                </div>
                            )}
                            {errors.modelIds && (
                                <FieldError>{errors.modelIds.message}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 hover:pointer disabled:opacity-50 mt-6"
                >
                    {isSubmitting ? "Saving..." : "Save Part"}
                </Button>
            </FieldSet>
        </form>
    );
}