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
  // Use structuredClone for deep cloning, which is safer for complex objects.
  return structuredClone(products.sort((a, b) => a.name.localeCompare(b.name)));
}

// Validation is now handled on the client-side before calling this action.
// The data received here is expected to be clean.
export async function upsertProduct(data: Omit<Product, 'imagePaths'> & { id?: string }): Promise<Product> {
  if (data.id) {
    // Update existing product
    const productIndex = products.findIndex(p => p.id === data.id);
    if (productIndex > -1) {
      products[productIndex] = {
        ...products[productIndex],
        ...data,
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
      ...data,
      id: `prod_${Date.now()}`,
      imagePaths: data.imageUrls.map((_, i) => `new/${Date.now()}_${i}`)
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
