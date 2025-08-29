"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { isAuthenticated } from "@/redux/slices/auth/authSlice";
import { Bell } from "lucide-react";

const Navbar = ({ apiNotifications }) => {
  const reduxAuth = useSelector(isAuthenticated);

  const unreadCount = apiNotifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-sm border-b border-slate-200/60 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm">
      <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
        <span className="hidden sm:inline">Comments App</span>
        <span className="sm:hidden">Comments</span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {reduxAuth ? (
          <>
            <Link
              href="/profile"
              className="group relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 ease-out text-sm sm:text-base min-h-[44px] flex items-center cursor-pointer"
            >
              <span className="relative z-10">Profile</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
            <Link
              href="/notifications"
              className="group relative px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-lg sm:rounded-xl font-medium border border-slate-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:scale-105 transition-all duration-200 ease-out min-h-[44px] flex items-center cursor-pointer"
            >
              <div className="flex items-center justify-center relative">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="group relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 ease-out text-sm sm:text-base min-h-[44px] flex items-center cursor-pointer"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
