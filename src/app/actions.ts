
"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/lib/types";
import { ImagePlaceholder } from "@/lib/placeholder-images";
import fs from "fs/promises";
import path from "path";

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');

// Lee los productos desde el archivo JSON
async function readProductsFromFile(): Promise<ImagePlaceholder[]> {
  try {
    const fileContent = await fs.readFile(productsFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.placeholderImages || [];
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
}

// Escribe los productos al archivo JSON
async function writeProductsToFile(products: ImagePlaceholder[]) {
  try {
    const data = { placeholderImages: products };
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing products file:", error);
  }
}

// Convierte el formato del archivo al formato de la aplicación
function convertToProduct(placeholder: ImagePlaceholder, index: number): Product {
    return {
        id: placeholder.id,
        name: placeholder.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: placeholder.description,
        // Asigna un precio consistente si no existe, para evitar que cambie
        price: parseFloat(((index + 1) * 23.45).toFixed(2)), 
        imageUrls: [placeholder.imageUrl],
        imagePaths: [`placeholder/${placeholder.id}`],
        category: placeholder.category,
    };
}


// Obtiene todos los productos
export async function getProducts(): Promise<Product[]> {
  const placeholders = await readProductsFromFile();
  // Ordena por nombre para consistencia
  placeholders.sort((a, b) => a.id.localeCompare(b.id)); 
  return placeholders.map(convertToProduct);
}


// Crea o actualiza un producto
export async function upsertProduct(data: Omit<Product, 'imagePaths'> & { id?: string }): Promise<Product> {
  const placeholders = await readProductsFromFile();
  const index = placeholders.findIndex(p => p.id === data.id);

  let productToReturn: Product;

  if (index > -1) {
    // Actualizar producto existente
    const existingPlaceholder = placeholders[index];
    placeholders[index] = {
      ...existingPlaceholder,
      id: data.id!,
      description: data.description,
      imageUrl: data.imageUrls[0], // Asumimos una sola imagen por ahora para simplicidad
      category: data.category,
      // imageHint no se puede derivar fácilmente aquí, mantenemos el existente
    };
    productToReturn = { ...data, id: data.id! };
  } else {
    // Crear nuevo producto
    const newId = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPlaceholder: ImagePlaceholder = {
      id: newId,
      description: data.description,
      imageUrl: data.imageUrls[0],
      imageHint: data.name, // Usar el nombre como hint inicial
      category: data.category,
    };
    placeholders.push(newPlaceholder);
    productToReturn = { ...data, id: newId };
  }

  await writeProductsToFile(placeholders);

  revalidatePath("/");
  revalidatePath("/admin/products");

  // Re-leemos para obtener el índice correcto para el precio
  const updatedProducts = await getProducts();
  return updatedProducts.find(p => p.id === productToReturn.id)!;
}

// Elimina un producto
export async function deleteProduct(id: string) {
  if (!id) throw new Error("Product ID is required.");
  
  let placeholders = await readProductsFromFile();
  const initialLength = placeholders.length;
  
  placeholders = placeholders.filter(p => p.id !== id);

  if (placeholders.length === initialLength) {
    console.warn(`Product with id ${id} not found for deletion.`);
  } else {
    await writeProductsToFile(placeholders);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}
