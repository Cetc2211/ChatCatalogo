import { getProducts } from "@/app/actions";
import ProductClient from "./client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Gestión de Productos</h1>
        <p className="text-muted-foreground">
          Añade, edita y elimina los productos de tu catálogo.
        </p>
      </div>
      <Suspense fallback={<Loader2 className="mx-auto my-16 h-10 w-10 animate-spin" />}>
        <ProductClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
