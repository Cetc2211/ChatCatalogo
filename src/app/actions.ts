"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/lib/types";
import { z } from 'zod';
import { PlaceHolderImages } from "@/lib/placeholder-images";

// In-memory store for products, initialized with placeholder data
let products: Product[] = PlaceHolderImages.map((p, index) => ({
  id: p.id,
  name: p.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  description: p.description,
  price: parseFloat(((index + 1) * 23.45).toFixed(2)),
  imageUrls: [p.imageUrl], // Changed to array
  imagePaths: [`placeholder/${p.id}`], // Changed to array
  category: p.category,
}));

export async function getProducts(): Promise<Product[]> {
  // Return a structured clone to prevent direct mutation and handle complex objects
  return structuredClone(products.sort((a, b) => a.name.localeCompare(b.name)));
}

const UpsertProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  price: z.coerce.number().positive("El precio debe ser un número positivo."),
  category: z.string().min(1, "La categoría es obligatoria."),
  imageUrls: z.array(z.string()).min(1, "Se requiere al menos una imagen."), 
  existingImagePaths: z.array(z.string()).optional(),
});

type UpsertProductData = z.infer<typeof UpsertProductSchema> & { images?: File[] };

export async function upsertProduct(data: UpsertProductData): Promise<Product> {
  // We're not handling file uploads to a backend, so we just use the provided imageUrls (data URLs).
  const validatedData = UpsertProductSchema.parse(data);
  
  if (validatedData.id) {
    // Update existing product
    const productIndex = products.findIndex(p => p.id === validatedData.id);
    if (productIndex > -1) {
      products[productIndex] = {
        ...products[productIndex],
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        imageUrls: validatedData.imageUrls, // Update image URLs
      };
      
      revalidatePath("/");
      revalidatePath("/admin/products");
      return products[productIndex];
    } else {
      throw new Error("Product not found");
    }
  } else {
    // Create new product
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      category: validatedData.category,
      imageUrls: validatedData.imageUrls,
      imagePaths: validatedData.imageUrls.map((_, i) => `new/${Date.now()}_${i}`)
    };
    products.unshift(newProduct); // Add to the beginning of the array

    revalidatePath("/");
    revalidatePath("/admin/products");
    return newProduct;
  }
}

export async function deleteProduct(id: string, imagePaths?: string[]) {
  if (!id) throw new Error("Product ID is required.");
  
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    console.warn(`Product with id ${id} not found for deletion.`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}
