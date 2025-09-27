
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
  imageUrls: [p.imageUrl],
  imagePaths: [`placeholder/${p.id}`],
  category: p.category,
}));

// This function now correctly merges in-memory changes with the initial placeholder data
export async function getProducts(): Promise<Product[]> {
  const productsMap = new Map<string, Product>();

  // 1. Add initial placeholder products to the map
  PlaceHolderImages.forEach((p, index) => {
    productsMap.set(p.id, {
      id: p.id,
      name: p.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: p.description,
      price: parseFloat(((index + 1) * 23.45).toFixed(2)),
      imageUrls: [p.imageUrl],
      imagePaths: [`placeholder/${p.id}`],
      category: p.category,
    });
  });

  // 2. Override placeholders with any modified in-memory products and add new ones
  products.forEach(p => {
    productsMap.set(p.id, p);
  });
  
  const mergedProducts = Array.from(productsMap.values());
  
  return structuredClone(mergedProducts.sort((a, b) => a.name.localeCompare(b.name)));
}

// The data received here is expected to be clean as validation happens client-side.
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
        // If the product doesn't exist in our memory but has an ID (e.g. placeholder), add it.
        const newProductFromPlaceholder: Product = {
            ...data,
            id: data.id,
            imagePaths: data.imageUrls.map((_, i) => `${data.id}_${i}`),
        };
        products.push(newProductFromPlaceholder);
        
        revalidatePath("/");
        revalidatePath("/admin/products");
        return newProductFromPlaceholder;
    }
  } else {
    // Create new product
    const newProduct: Product = {
      ...data,
      id: `prod_${Date.now()}`,
      imagePaths: data.imageUrls.map((_, i) => `new/${Date.now()}_${i}`)
    };
    products.push(newProduct);

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
