import { db } from "@/app/lib/db"
import { chats } from "@/app/lib/db/schema"
import MobileSidebar from "@/components/dashboard/MobileSidebar"

import Sidebar from "@/components/dashboard/Sidebar"
import { checkSubscription } from "@/app/lib/subscription"
import { auth, currentUser } from "@clerk/nextjs/server"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { FileText, Sparkles, Zap, Shield } from "lucide-react"

const DashboardPage = async () => {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        return redirect("/sign-in")
    }

    // Fetch user chats
    const _chats = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId))
        .orderBy(desc(chats.createdAt))

    // Fetch subscription status
    const subscription = await checkSubscription()

    return (
        <div className="flex max-h-screen overflow-hidden bg-[#0a0a0a]">
            <div className="flex w-full h-full flex-col md:flex-row">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex flex-[1] px-4 max-w-md border-r border-gray-800/50">
                    <Sidebar chatId={0} chats={_chats} />
                </div>

                {/* Main Dashboard Content */}
                <div className="flex-[8] max-h-screen overflow-y-auto bg-[#0a0a0a]">

                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center p-4 border-b border-gray-800 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
                        <MobileSidebar chatId={0} chats={_chats} />
                        <span className="ml-2 font-bold text-lg text-gray-100">Dashboard</span>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                                    <i>Welcome back, {user.firstName || 'User'}!</i>
                                </h1>
                                <p className="text-gray-400">
                                    Here's an overview of your activity and subscription.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                {/* Plan Card */}
                                <div className="p-6 rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full tracking-wide ${subscription.plan === 'pro'
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                            : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                                            }`}>
                                            {subscription.plan === 'pro' ? 'PRO' : 'FREE'}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-100 mb-1 capitalize">
                                        {subscription.plan} Plan
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Current subscription tier
                                    </p>
                                </div>

                                {/* Usage Card */}
                                <div className="p-6 rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 tracking-wide">
                                            {subscription.plan === 'free' ? 'No reset' : 'Monthly reset'}
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-2 mb-1">
                                        <h3 className="text-2xl font-bold text-gray-100">
                                            {subscription.pdfCount}
                                        </h3>
                                        <span className="text-sm text-gray-500 mb-1">/ {subscription.pdfLimit} PDFs</span>
                                    </div>
                                    <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden mt-3">
                                        <div
                                            className={`h-full rounded-full transition-all ${(subscription.pdfCount || 0) >= (subscription.pdfLimit || 1)
                                                ? 'bg-red-500'
                                                : 'bg-cyan-500'
                                                }`}
                                            style={{ width: `${Math.min(((subscription.pdfCount || 0) / (subscription.pdfLimit || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Total Chats Card */}
                                <div className="p-6 rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-100 mb-1">
                                        {_chats.length}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Total documents uploaded
                                    </p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                Recent Documents
                            </h2>

                            {_chats.length === 0 ? (
                                <div className="text-center py-12 rounded-xl border border-dashed border-gray-800 bg-[#141414]/50">
                                    <p className="text-gray-500">No documents yet. Upload one from the sidebar!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {_chats.slice(0, 4).map(chat => (
                                        <a
                                            key={chat.id}
                                            href={`/dashboard/${chat.id}`}
                                            className="p-4 rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all flex items-center gap-4 group"
                                        >
                                            <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                                                    {chat.pdfName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(chat.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DashboardPage