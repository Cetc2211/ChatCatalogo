import { getProducts } from "@/app/actions";
import ProductList from "@/components/product-list";
import SiteHeader from "@/components/site-header";
import { PackageOpen } from "lucide-react";
import { Product } from "@/lib/types";

export default async function Home() {
  const products = await getProducts();
  
  const productsByCategory: Record<string, Product[]> = products.reduce((acc, product) => {
    const category = product.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(productsByCategory).sort();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 text-center bg-card border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline">
              ¡Bienvenido a Nuestro Catálogo!
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Explora nuestra selección de productos de alta calidad.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {products.length > 0 ? (
            <div className="space-y-12">
              {categories.map((category) => (
                <section key={category}>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-8 font-headline">
                    {category}
                  </h2>
                  <ProductList products={productsByCategory[category]} />
                </section>
              ))}
            </div>
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
