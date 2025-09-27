
"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Product } from "@/lib/types";
import { upsertProduct } from "@/app/actions";
import { enhanceProductDescription } from "@/ai/flows/enhance-product-description";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, X } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

// This schema is now used on the client-side for validation before submitting to the server action.
const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  price: z.coerce.number({invalid_type_error: "El precio debe ser un número."}).positive("El precio debe ser un número positivo."),
  category: z.string().min(1, "La categoría es obligatoria."),
  imageUrls: z.array(z.string()).min(1, "Se requiere al menos una imagen."),
});

// The form values type now reflects the input types more accurately.
type ProductFormValues = {
    name: string;
    description: string;
    price: string | number; // Allow string for input, coerce to number for validation
    category: string;
    images: FileList | null; // For the file input
};

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product | null;
  onSuccess: (product: Product) => void;
  categories: { value: string; label: string }[];
  setCategories: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
}

export function ProductForm({ isOpen, onOpenChange, product, onSuccess, categories, setCategories }: ProductFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const [isAiLoading, startAiTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: async (data, context, options) => {
        // We create a new object for validation that includes previewImages
        const validationData = {
            ...data,
            imageUrls: previewImages,
        };
        return zodResolver(productSchema)(validationData, context, options);
    },
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      images: null,
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: null,
        });
        setPreviewImages(product.imageUrls);
      } else {
        form.reset({ name: "", description: "", price: "", category: "", images: null });
        setPreviewImages([]);
      }
    }
  }, [product, isOpen, form.reset]);


  const handleCreateCategory = (newCategory: string) => {
    const newCategoryOption = { value: newCategory, label: newCategory };
    if (!categories.some(c => c.value.toLowerCase() === newCategory.toLowerCase())) {
      setCategories(prev => [...prev, newCategoryOption]);
    }
    form.setValue('category', newCategory, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      // Validate and prepare data on the client
      const validatedData = productSchema.parse({
          ...data,
          imageUrls: previewImages,
      });

      const newProduct = await upsertProduct({
        id: product?.id,
        ...validatedData
      });

      toast({
        title: "Éxito",
        description: `Producto ${product ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSuccess(newProduct);
    } catch (error) {
       if (error instanceof z.ZodError) {
        // This will now catch validation errors on the client
        console.error("Validation error:", error.errors);
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: error.errors[0]?.message || "Por favor, revisa los campos del formulario.",
        });
      } else {
        console.error("Upsert error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `No se pudo ${product ? 'actualizar' : 'crear'} el producto.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImageUrls: string[] = [];
      const fileArray = Array.from(files);
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImageUrls.push(reader.result as string);
          if(newImageUrls.length === fileArray.length) {
            setPreviewImages(prev => [...prev, ...newImageUrls]);
            // Manually trigger validation for imageUrls
            form.trigger('category');
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => {
        const newImages = prev.filter((_, i) => i !== index);
        // Manually update form state and trigger validation
        form.setValue('imageUrls', newImages, { shouldValidate: true });
        return newImages;
    });
  }
  
  const handleEnhanceDescription = () => {
    const { name, description } = form.getValues();
    if (!name || !description) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "Por favor, introduce un nombre y una descripción antes de mejorar con IA.",
      });
      return;
    }
    startAiTransition(async () => {
      try {
        const result = await enhanceProductDescription({ productName: name, productDescription: description });
        setAiSuggestion(result.enhancedDescription);
      } catch (error) {
        console.error("AI enhancement failed:", error);
        toast({
          variant: "destructive",
          title: "Error de IA",
          description: "No se pudo generar la descripción. Inténtalo de nuevo.",
        });
      }
    });
  };

  const applyAiSuggestion = () => {
    if(aiSuggestion) {
      form.setValue('description', aiSuggestion, { shouldValidate: true });
      setAiSuggestion(null);
      toast({
          title: "Descripción actualizada",
          description: "La sugerencia de la IA ha sido aplicada.",
      });
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{product ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {product ? "Modifica los detalles del producto." : "Rellena los detalles del nuevo producto."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Cámara Vintage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Descripción</FormLabel>
                      <Button type="button" variant="ghost" size="sm" onClick={handleEnhanceDescription} disabled={isAiLoading}>
                        {isAiLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Mejorar con IA
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea placeholder="Describe tu producto..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio (MXN)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="19.99" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Combobox
                          options={categories}
                          value={field.value}
                          onChange={(value) => form.setValue('category', value, { shouldValidate: true })}
                          onCreate={handleCreateCategory}
                          placeholder="Seleccionar o crear..."
                          createLabel="Crear nueva categoría"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imágenes</FormLabel>
                     <FormMessage>{form.formState.errors.imageUrls?.message}</FormMessage>
                    <div className="grid grid-cols-3 gap-2">
                      {previewImages.map((src, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image src={src} alt={`Previsualización ${index + 1}`} fill className="rounded-md object-cover" />
                           <Button 
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() => removePreviewImage(index)}
                           >
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                      ))}
                    </div>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleImageChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {product ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!aiSuggestion} onOpenChange={() => setAiSuggestion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sugerencia de la IA</AlertDialogTitle>
            <AlertDialogDescription>
              Hemos generado una nueva descripción para tu producto. Puedes usarla o mantener la actual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto rounded-md border bg-muted/50 p-4 text-sm">
            {aiSuggestion}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={applyAiSuggestion}>Usar esta descripción</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
