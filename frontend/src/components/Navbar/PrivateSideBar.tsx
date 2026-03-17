"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
    LayoutDashboard,
    Users,
    Truck,
    BarChart3,
    FileText,
    ChevronRight,
    Settings,
    Sparkles,
    HelpCircle,
    LogOut,
    Menu,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const navItems = [
    {
        label: "Dashboard",
        href: "/home",
        icon: LayoutDashboard,
    },
    {
        label: "Sellers",
        href: "/home/seller",
        icon: Users,
    },
    {
        label: "Deliveries",
        href: "/deliveries",
        icon: Truck,
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        label: "Reports",
        href: "/reports",
        icon: FileText,
    },
]

const PrivateSideBar = () => {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { user } = useUser()
    const router = useRouter()

    const displayName = user?.username ?? "..."
    const displayEmail = user?.email ?? ""
    const avatarInitials = displayName.slice(0, 2).toUpperCase()

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
            if (!res.ok) throw new Error("Logout failed")
            toast.success("Logged out successfully!")
            router.push("/home")
        } catch {
            toast.error("Logout failed. Please try again.")
        }
    }

    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const isActive = (href: string) => {
        if (href === "/home") return pathname === "/home"
        return pathname.startsWith(href)
    }

    const sidebarBody = (
        <>
            {/* ── Brand ─────────────────────────────────── */}
            <div className="flex px-5 mb-6 select-none">
                <Link
                    href="/home"
                    onClick={() => setIsMobileOpen(false)}
                    className="group relative w-full h-14 flex justify-center items-center rounded-lg overflow-hidden shrink-0 mt-2 transition-transform duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                    <Image
                        src="/Logo.png"
                        alt="Invoice IQ"
                        height={96}
                        width={96}
                        className="object-contain drop-shadow-sm dark:hidden w-24 h-24"
                    />
                    <Image
                        src="/DarkLogo.png"
                        alt="Invoice IQ"
                        height={96}
                        width={96}
                        className="object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] w-24 h-24"
                    />
                </Link>
            </div>

            {/* ── Quick Action Button ────────────────────── */}
            <div className="px-4 mb-6">
                <button className="
                    w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                    bg-[#1E3A8A] hover:bg-[#152e73] dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white font-medium text-sm
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-blue-900/20 dark:hover:shadow-blue-500/20
                    active:scale-[0.98]
                ">
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    <span>Summarise with AI</span>
                </button>
            </div>

            {/* ── Navigation List ───────────────────────── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">

                {/* Main Menu */}
                <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30">
                    Menu
                </p>
                <nav className="flex flex-col gap-1 px-3 mb-6">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "group relative flex items-center justify-between px-3 py-2.5 rounded-lg",
                                    "text-sm font-medium transition-all duration-200 ease-out",
                                    active
                                        ? [
                                            "bg-[#1E3A8A]/5 dark:bg-white/10",
                                            "text-[#1E3A8A] dark:text-white",
                                        ]
                                        : [
                                            "text-gray-500 dark:text-white/50",
                                            "hover:bg-gray-100 dark:hover:bg-white/5",
                                            "hover:text-gray-900 dark:hover:text-white/80",
                                        ]
                                )}
                            >
                                {active && (
                                    <span className="
                                        absolute left-0 top-1/2 -translate-y-1/2
                                        w-0.75 h-5 rounded-r-full
                                        bg-[#1E3A8A] dark:bg-blue-400
                                        animate-in fade-in slide-in-from-left-1 duration-300
                                    " />
                                )}

                                <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-1">
                                    <Icon
                                        className={cn(
                                            "shrink-0 transition-all duration-200",
                                            active
                                                ? "text-[#1E3A8A] dark:text-blue-400"
                                                : "text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/70",
                                            "w-4 h-4"
                                        )}
                                        strokeWidth={active ? 2.25 : 2}
                                    />
                                    <span className="leading-none">{item.label}</span>
                                </div>

                                {active && (
                                    <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0 animate-in fade-in slide-in-from-right-1 duration-300" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Preferences Menu */}
                <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30">
                    Preferences
                </p>
                <nav className="flex flex-col gap-1 px-3">
                    <button className="
                        group relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-200 ease-out
                        text-gray-500 dark:text-white/50
                        hover:bg-gray-100 dark:hover:bg-white/5
                        hover:text-gray-900 dark:hover:text-white/80
                    ">
                        <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-1">
                            <Settings className="w-4 h-4 shrink-0 transition-transform duration-500 group-hover:rotate-90" strokeWidth={2} />
                            <span className="leading-none">Settings</span>
                        </div>
                    </button>
                    <button className="
                        group relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-200 ease-out
                        text-gray-500 dark:text-white/50
                        hover:bg-gray-100 dark:hover:bg-white/5
                        hover:text-gray-900 dark:hover:text-white/80
                    ">
                        <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-1">
                            <HelpCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
                            <span className="leading-none">Help & Support</span>
                        </div>
                    </button>
                </nav>
            </div>

            {/* ── Footer / User Profile ─────────────────── */}
            <div className="mt-auto px-3 pt-4 pb-2 border-t border-gray-100 dark:border-white/6">
                <div className="
                    group flex items-center gap-3 p-2 rounded-xl cursor-pointer
                    transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-white/5
                ">
                    <div className="
                        w-9 h-9 rounded-full shrink-0 shadow-inner overflow-hidden
                        bg-linear-to-tr from-[#1E3A8A] to-blue-400 dark:from-blue-600 dark:to-blue-400
                        flex items-center justify-center
                        transition-transform duration-300 group-hover:scale-105
                    ">
                        <span className="text-white text-xs font-bold leading-none">{avatarInitials}</span>
                    </div>

                    <div className="flex flex-col justify-center flex-1 overflow-hidden transition-transform duration-200 group-hover:translate-x-0.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate text-left leading-tight">
                            {displayName}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500 dark:text-white/40 truncate text-left mt-0.5">
                            {displayEmail}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="inline-flex p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-white/10"
                        title="Log out"
                    >
                        <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    </button>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile menu trigger */}
            <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl bg-white/90 dark:bg-[#111318]/90 border border-gray-200 dark:border-white/10 shadow-md backdrop-blur-sm text-gray-700 dark:text-white"
                aria-label="Toggle sidebar"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile backdrop */}
            {isMobileOpen && (
                <button
                    className="fixed inset-0 bg-black/45 z-40 md:hidden"
                    aria-label="Close sidebar"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen z-50 md:hidden",
                    "flex flex-col",
                    "w-[85%] max-w-70",
                    "bg-white dark:bg-[#111318]",
                    "border-r border-gray-100 dark:border-white/6",
                    "py-5 font-outfit",
                    "transition-transform duration-300",
                    "shadow-[1px_0_10px_rgba(0,0,0,0.02)] dark:shadow-none",
                    isMobileOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
                )}
            >
                {sidebarBody}
            </aside>

            {/* Tablet + Desktop Sticky Sidebar */}
            <aside
                className="hidden md:flex md:sticky md:top-0 md:h-screen md:w-55 shrink-0 z-30 flex-col bg-white dark:bg-[#111318] border-r border-gray-100 dark:border-white/6 py-5 font-outfit shadow-[1px_0_10px_rgba(0,0,0,0.02)] dark:shadow-none"
            >
                {sidebarBody}
            </aside>
        </>
    )
}

export default PrivateSideBar