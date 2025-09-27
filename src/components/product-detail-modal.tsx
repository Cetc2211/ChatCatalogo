
"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { WhatsAppDialog } from "./whatsapp-dialog";
import { Badge } from "./ui/badge";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

export function ProductDetailModal({ product, isOpen, onOpenChange }: ProductDetailModalProps) {
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);

  if (!product) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <Carousel className="w-full group">
                <CarouselContent>
                  {product.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={url}
                          alt={`${product.name} - imagen ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
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
            </div>

            <div className="flex flex-col p-6">
              <DialogHeader className="text-left">
                <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                <DialogTitle className="text-3xl font-bold font-headline">{product.name}</DialogTitle>
                 <p className="text-3xl font-bold text-primary py-2">{formatPrice(product.price)}</p>
              </DialogHeader>

              <div className="flex-1 my-4">
                <DialogDescription className="text-base text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </DialogDescription>
              </div>

              <Button onClick={() => setIsWhatsAppDialogOpen(true)} size="lg" className="w-full">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar por WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <WhatsAppDialog
        isOpen={isWhatsAppDialogOpen}
        onOpenChange={setIsWhatsAppDialogOpen}
        productName={product.name}
      />
    </>
  );
}
