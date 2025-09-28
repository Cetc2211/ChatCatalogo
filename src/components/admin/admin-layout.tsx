"use client"

import * as React from "react"
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Package, LogOut, ChevronDown, Eye, Settings } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    logout()
    router.push("/login")
  }

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "?";
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg">Admin</h1>
             <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link href="/" target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Sitio
                </Link>
             </Button>
            <div className="ml-2">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/admin/products")}
                isActive={pathname.startsWith("/admin/products")}
                tooltip="Gestionar productos"
              >
                <Package />
                <span>Productos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/admin/settings")}
                isActive={pathname.startsWith("/admin/settings")}
                tooltip="Configuración"
              >
                <Settings />
                <span>Ajustes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start w-full text-left h-auto p-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-8">
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        {/* AvatarImage is removed as user object does not have photoURL */}
                        <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-sm font-medium">{user.email}</span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
