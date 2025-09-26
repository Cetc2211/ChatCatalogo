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
  imageUrl: p.imageUrl,
  imagePath: `placeholder/${p.id}`
}));

export async function getProducts(): Promise<Product[]> {
  // Return a copy to prevent direct mutation of the in-memory store
  return JSON.parse(JSON.stringify(products.sort((a, b) => a.name.localeCompare(b.name))));
}

const UpsertProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  price: z.coerce.number().positive("El precio debe ser un número positivo."),
  // We'll ignore image uploads for now as we don't have a backend storage.
  // We will keep the field to avoid breaking the form.
  image: z.any().optional(), 
  existingImagePath: z.string().optional(),
});

type UpsertProductData = z.infer<typeof UpsertProductSchema>;

export async function upsertProduct(data: UpsertProductData): Promise<Product> {
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
      // For new products, let's just cycle through placeholder images
      imageUrl: PlaceHolderImages[products.length % PlaceHolderImages.length].imageUrl,
      imagePath: `new/${Date.now()}`
    };
    products.unshift(newProduct); // Add to the beginning of the array

    revalidatePath("/");
    revalidatePath("/admin/products");
    return newProduct;
  }
}

export async function deleteProduct(id: string, imagePath?: string) {
  if (!id) throw new Error("Product ID is required.");
  
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    // For robustness, in case a product with the ID was not found.
    // In a real DB, this might be an error, but here we can be lenient.
    console.warn(`Product with id ${id} not found for deletion.`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}
