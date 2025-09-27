export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath?: string; // To keep track of the file in Storage for deletion
  category: string;
}
