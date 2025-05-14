import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getServerSession } from "next-auth"

import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default  async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions as any)
    if (!session) {
        return redirect("/login")
    }
    return (
        <div className="w-screen">
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}
