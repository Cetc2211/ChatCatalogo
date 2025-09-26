import Link from 'next/link';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">Catálogo de Chat Commerce</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button asChild variant="ghost">
              <Link href="/admin/products">
                Admin
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
