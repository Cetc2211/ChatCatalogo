
"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { ProductForm } from "./product-form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/app/actions";

export default function ProductClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const uniqueCategories = [...new Set(initialProducts.map(p => p.category))];
    setCategories(uniqueCategories.map(c => ({ value: c, label: c })));
  }, [initialProducts]);
  
  const handleOpenForm = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([product, ...products]);
    }
     // Actualizar categorías si se crea una nueva
    if (!categories.some(c => c.value === product.category)) {
      setCategories(prev => [...prev, { value: product.category, label: product.category }]);
    }
    
    setIsFormOpen(false);
    setEditingProduct(null);
  };
  
  const onProductDeleted = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>
      <DataTable 
        columns={columns({ onEdit: handleOpenForm, onProductDeleted })} 
        data={products} 
      />
      {isFormOpen && (
        <ProductForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          product={editingProduct}
          onSuccess={handleFormSuccess}
          categories={categories}
          setCategories={setCategories}
        />
      )}
    </>
  );
}
