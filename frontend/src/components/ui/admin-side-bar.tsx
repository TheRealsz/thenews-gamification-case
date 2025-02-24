import { TheNewsIcon } from "@/assets/svg/the-news-icon"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router"

export function AdminSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation()

    const data = {
        navMain: [
            {
                title: "Estatísticas",
                url: "#",
                items: [
                    {
                        title: "Usuários",
                        url: "/admin/users",
                        isActive: location.pathname === "/admin/users",
                    },
                    {
                        title: "Newsletters",
                        url: "/admin/newsletters",
                        isActive: location.pathname === "/admin/newsletters",
                    },
                ],
            }
        ],
    }

    return (
        <Sidebar {...props} className="bg-zinc-200">
            <SidebarHeader className="bg-zinc-200">
                <TheNewsIcon className="w-40 h-20" />
            </SidebarHeader>
            <SidebarContent className="bg-zinc-200">
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive} className={item.isActive ? "data-[active=true]:bg-supernova-400" : ""}>
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
