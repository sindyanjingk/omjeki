"use client"
import { Calendar, CircleUserIcon, Home, Inbox, ListTodoIcon, LogOut, PersonStandingIcon, Search, Settings, ShoppingBagIcon, User2Icon } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Product",
        url: "/dashboard/product",
        icon: ShoppingBagIcon,
    },
    {
        title: "Seller",
        url: "/dashboard/seller",
        icon: CircleUserIcon,
    },
    {
        title: "User",
        url: "/dashboard/user",
        icon: User2Icon,
    },
    {
        title: "Transaksi",
        url: "/dashboard/transaction",
        icon: ListTodoIcon,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem className="gap-x-2 flex items-center mt-96" key={"logout"}>
                                <Button onClick={() => signOut()}>
                                    <LogOut size={16} />
                                    <div>Logout</div>
                                </Button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
