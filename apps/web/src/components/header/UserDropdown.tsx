"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Button } from '../ui/button';
// import { notify } from '@/lib/toast';
import { UserRound } from "lucide-react";

const UserDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
        aria-label="User menu"
      >
        {/* <Image
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          src="/images/user/user-01.png"
          alt={'User'}
        /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {/* <Image
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-3"
                src="/images/user/user-01.png"
                alt={session?.user?.email || 'User'}
              /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
                  {session?.user?.email || (loading ? "Loading…" : "Guest")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(session?.user as any)?.role || "anon"}
                </p>
              </div>
            </div>
          </div>
          <div className="py-1">
            {/* <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Profile
            </Link>
            <RequireAnyRole
              roles={["admin", "org_admin", "reviewer", "finance", "auditor"]}
            >
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
              >
                Admin Panel
              </Link>
            </RequireAnyRole>
            <Link
              href="/portal/dashboard"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              Customer Portal
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
            <Link
              href="/billing"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Billing
            </Link> */}
            {/* <Button onClick={() => notify.success("Click")}>
              Click
            </Button>
            <Button onClick={() => notify.error("Click")}>
              Click
            </Button>
            <Button onClick={() => notify.info("Click")}>
              Click
            </Button> */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            {session?.user && (
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
