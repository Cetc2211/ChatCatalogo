export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Changed from imageUrl
  imagePaths?: string[]; // Changed from imagePath
  category: string;
}
