"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

interface WhatsAppDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  productName: string;
}

// !! IMPORTANTE: Reemplaza este número con el número de WhatsApp de tu negocio.
// Formato internacional sin '+' o '00'. Ejemplo: 34123456789 para España.
const BUSINESS_PHONE_NUMBER = "3111477413";

export function WhatsAppDialog({ isOpen, onOpenChange, productName }: WhatsAppDialogProps) {
  const message = `¡Hola! Estoy interesado/a en comprar el "${productName}".`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${BUSINESS_PHONE_NUMBER}?text=${encodedMessage}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="text-green-500" />
            Contactar por WhatsApp
          </DialogTitle>
          <DialogDescription>
            Serás redirigido a WhatsApp para iniciar una conversación con nosotros.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 rounded-md border bg-muted/50 p-4">
          <p className="text-sm text-foreground">{message}</p>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button asChild className="w-full sm:w-auto">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>
              Iniciar Conversación
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
