"use client";

import NotificationDropdown from "@/components/Header/NotificationDropdown";
import UserDropdown from "@/components/Header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Logo from "@/components/ui/logo";

interface AppHeaderProps {
  setOpen: () => void;
}

const AppHeader = ({ setOpen }: AppHeaderProps) => {
  const { toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    setOpen();
    toggleMobileSidebar();
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200/80 z-40 h-14 shadow-sm">
      <div className="flex items-center justify-between w-full px-4 lg:px-6">
        {/* Left section - only visible on mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="flex items-center justify-center w-9 h-9 text-gray-500 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <svg width="18" height="14" viewBox="0 0 16 12" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <Link href="/" className="flex-shrink-0">
            <div className="h-7 w-auto">
              <Logo classNames="h-full w-auto object-contain" />
            </div>
          </Link>
        </div>

        {/* Center section - Search Bar */}
        <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-auto">
          <form className="w-full max-w-md">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors">
                <svg
                  className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search task..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 pl-9 pr-16 text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <span>⌘</span>
                <span>F</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
