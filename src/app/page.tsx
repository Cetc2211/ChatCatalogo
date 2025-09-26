import { getProducts } from "@/app/actions";
import ProductList from "@/components/product-list";
import SiteHeader from "@/components/site-header";
import { PackageOpen } from "lucide-react";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 font-headline text-center">
            Nuestro Catálogo
          </h1>
          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <PackageOpen className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-semibold text-foreground">No hay productos todavía</h2>
              <p className="mt-2 text-muted-foreground">Vuelve a consultar más tarde o añade algunos productos en el panel de administración.</p>
            </div>
          )}
        </div>
      </main>
       <footer className="py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex items-center justify-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Catálogo de Chat Commerce. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
