"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppDialog } from "./whatsapp-dialog";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

export function ProductCard({ product }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <CardTitle className="mb-2 text-xl font-headline">{product.name}</CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-3">
            {product.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <p className="text-xl font-semibold text-primary">{formatPrice(product.price)}</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar Ahora
          </Button>
        </CardFooter>
      </Card>
      <WhatsAppDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productName={product.name}
      />
    </>
  );
}
