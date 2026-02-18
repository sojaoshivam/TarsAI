import { db } from "@/app/lib/db"
import { chats } from "@/app/lib/db/schema"
import MobileSidebar from "@/components/dashboard/MobileSidebar"
import Sidebar from "@/components/dashboard/Sidebar"
import { auth, currentUser } from "@clerk/nextjs/server"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        return redirect("/sign-in")
    }

    // Fetch user chats for sidebar
    const _chats = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId))
        .orderBy(desc(chats.createdAt))

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a]">
            {/* Desktop Sidebar - Hidden on mobile/tablet, visible from md breakpoint */}
            <aside className="hidden lg:flex lg:w-80 lg:flex-shrink-0 border-r border-gray-800/50">
                <Sidebar chatId={0} chats={_chats} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile/Tablet Header */}
                <header className="lg:hidden flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50 gap-2">
                    <MobileSidebar chatId={0} chats={_chats} />
                    <h1 className="font-bold text-base sm:text-lg text-gray-100 flex-1 truncate">TARS AI</h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
