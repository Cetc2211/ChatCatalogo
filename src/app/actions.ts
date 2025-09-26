"use server";

import { revalidatePath } from "next/cache";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/lib/types";
import { z } from 'zod';

const productsCollection = collection(db, "products");

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(productsCollection, orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

const UpsertProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  price: z.coerce.number().positive("El precio debe ser un número positivo."),
  image: z.any().optional(),
  existingImagePath: z.string().optional(),
});

type UpsertProductData = z.infer<typeof UpsertProductSchema>;

export async function upsertProduct(data: UpsertProductData): Promise<Product> {
  const validatedData = UpsertProductSchema.parse(data);
  let imageUrl = '';
  let imagePath = validatedData.existingImagePath;

  if (validatedData.image) {
    // If there's an old image, delete it
    if (imagePath) {
      try {
        await deleteObject(ref(storage, imagePath));
      } catch (error: any) {
        // Ignore "object not found" errors, as it might have been deleted manually
        if (error.code !== 'storage/object-not-found') {
          console.error("Error deleting old image:", error);
        }
      }
    }

    const file = validatedData.image;
    imagePath = `products/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  const productData = {
    name: validatedData.name,
    description: validatedData.description,
    price: validatedData.price,
    ...(imageUrl && { imageUrl }),
    ...(imagePath && { imagePath }),
  };

  let productId = validatedData.id;
  if (productId) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, productData);
  } else {
    const docRef = await addDoc(productsCollection, productData);
    productId = docRef.id;
  }
  
  const finalProduct: Product = {
    id: productId!,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    imageUrl: imageUrl || (await getDocs(doc(db, "products", productId!))).data()?.imageUrl,
    imagePath: imagePath,
  }

  revalidatePath("/");
  revalidatePath("/admin/products");

  return finalProduct;
}

export async function deleteProduct(id: string, imagePath?: string) {
  if (!id) throw new Error("Product ID is required.");
  
  if (imagePath) {
    const imageRef = ref(storage, imagePath);
    try {
      await deleteObject(imageRef);
    } catch (error: any) {
      if (error.code !== 'storage/object-not-found') {
        console.error("Error deleting image from storage:", error);
        throw new Error("Could not delete product image.");
      }
    }
  }

  await deleteDoc(doc(db, "products", id));
  
  revalidatePath("/");
  revalidatePath("/admin/products");
}
