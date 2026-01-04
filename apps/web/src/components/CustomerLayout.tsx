"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  // FolderOpen,
  // FileCheck,
  User,
  Zap,
} from "lucide-react";
import Logo from "@/components/ui/logo";

interface CustomerLayoutProps {
  readonly children: React.ReactNode;
}

const primaryNav = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Quotes", href: "/portal/quotes", icon: FileText },
  { label: "Orders", href: "/portal/orders", icon: ShoppingCart },
  // { label: "Files", href: "/portal/files", icon: FolderOpen },
  // { label: "Documents", href: "/portal/documents", icon: FileCheck },
  { label: "Account", href: "/portal/account", icon: User },
  { label: "Instant Quote", href: "/instant-quote", icon: Zap },
];

export default function CustomerLayout({
  children,
}: Readonly<CustomerLayoutProps>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafbfc]">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200/80 flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out shadow-sm",
          "lg:static lg:h-full",
          mobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-64 w-64 lg:translate-x-0",
          desktopOpen ? "lg:w-64" : "lg:w-16",
        )}
      >
        {/* Header */}
        <div className="h-14 flex items-center py-2 px-4 border-b border-gray-100 gap-2.5">
          {/* Collapse Toggle - Desktop */}
          <button
            onClick={() => setDesktopOpen((o) => !o)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200"
            title="Toggle sidebar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300"
              style={{
                transform: desktopOpen ? "rotate(0deg)" : "rotate(180deg)",
              }}
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <Link
            href="/portal/dashboard"
            className={cn(
              "flex items-center gap-2 transition-opacity",
              desktopOpen
                ? "opacity-100"
                : "lg:opacity-0 lg:w-0 lg:overflow-hidden",
            )}
          >
            <div className="h-12 w-auto flex-shrink-0">
              <Logo classNames="h-full w-auto object-contain" />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <ul className="space-y-1">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 relative group",
                      active
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      !desktopOpen && "lg:justify-center lg:px-2",
                    )}
                    title={!desktopOpen ? item.label : undefined}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
                    )}
                    <Icon size={19} className="flex-shrink-0" />
                    <span
                      className={cn(
                        "transition-all duration-300 whitespace-nowrap",
                        desktopOpen
                          ? "opacity-100"
                          : "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 w-full bg-[#f8f9fa]">
        <AppHeader setOpen={() => setDesktopOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto w-full p-6">{children}</main>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-50 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-md hover:shadow-lg px-4 py-2.5 lg:hidden hover:bg-gray-50 transition-all duration-200 text-sm font-medium active:scale-95"
      >
        {mobileOpen ? "Close" : "Menu"}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
