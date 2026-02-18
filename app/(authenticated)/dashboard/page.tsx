import { checkSubscription } from "@/app/lib/subscription"
import { currentUser } from "@clerk/nextjs/server"
import { FileText, Sparkles, Zap, Shield } from "lucide-react"

const DashboardPage = async () => {
    const user = await currentUser()

    // Fetch subscription status
    const subscription = await checkSubscription()

    return (
        <div className="w-full min-h-full bg-[#0a0a0a] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-2">
                        <i>Welcome back, {user?.firstName || 'User'}!</i>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Here's an overview of your activity and subscription.
                    </p>
                </div>

                {/* Stats Grid - Responsive across all screen sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
                    {/* Plan Card */}
                    <div className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className={`text-xs font-medium px-2 sm:px-3 py-1 rounded-full tracking-wide truncate ${subscription.plan === 'pro'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                                }`}>
                                {subscription.plan === 'pro' ? 'PRO' : 'FREE'}
                            </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-100 mb-1 capitalize">
                            {subscription.plan} Plan
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Subscription tier
                        </p>
                    </div>

                    {/* Usage Card */}
                    <div className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 tracking-wide whitespace-nowrap ml-2">
                                {subscription.plan === 'free' ? 'No reset' : 'Monthly reset'}
                            </span>
                        </div>
                        <div className="flex items-end gap-1 sm:gap-2 mb-2 sm:mb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-100">
                                {subscription.pdfCount}
                            </h3>
                            <span className="text-xs sm:text-sm text-gray-500">/ {subscription.pdfLimit} PDFs</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5 sm:h-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${(subscription.pdfCount || 0) >= (subscription.pdfLimit || 1)
                                    ? 'bg-red-500'
                                    : (subscription.pdfCount || 0) >= (subscription.pdfLimit || 1) * 0.8
                                        ? 'bg-amber-500'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`}
                                style={{ width: `${Math.min(((subscription.pdfCount || 0) / (subscription.pdfLimit || 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Active Chats Card */}
                    <div className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-[#141414] border border-gray-800 hover:border-cyan-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 tracking-wide whitespace-nowrap ml-2">
                                Uploaded
                            </span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-100 mb-1">
                            {subscription.pdfCount}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Active documents
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-[#141414] border border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-cyan-500/10 flex-shrink-0">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Getting Started</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                                Upload a PDF to your library to start asking questions. Our AI will analyze the content and provide intelligent responses based on your documents.
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <a href="/help" className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Learn more →
                                </a>
                                <span className="text-gray-700">•</span>
                                <a href="/settings" className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Settings →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
