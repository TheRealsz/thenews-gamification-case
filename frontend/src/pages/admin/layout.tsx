import { TheNewsIcon } from "@/assets/svg/the-news-icon";
import { AdminSideBar } from "@/components/ui/admin-side-bar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSideBar />
            <SidebarInset className="bg-zinc-100">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center w-full justify-center">
                        <TheNewsIcon className="w-32 h-20 " />
                    </div>
                    <LogOut className="text-red-500 size-6" />
                </header>
                <div className="w-full h-full p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}