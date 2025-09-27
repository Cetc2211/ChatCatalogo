
"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <Card 
      className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer group"
      onClick={onViewDetails}
    >
      <Carousel className="w-full relative">
        <CarouselContent>
          {product.imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={url}
                  alt={`${product.name} - imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {product.imageUrls.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
        <p className="font-bold text-primary mt-2">{formatPrice(product.price)}</p>
      </CardContent>
    </Card>
  );
}
