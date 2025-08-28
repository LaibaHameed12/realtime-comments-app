"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { isAuthenticated, getUser } from "@/redux/slices/auth/authSlice";
import { Bell } from "lucide-react";
import { useGetNotificationsQuery } from "@/redux/slices/notifications/notificationsApi";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

const Navbar = () => {
  const reduxAuth = useSelector(isAuthenticated);
  const currentUser = useSelector(getUser);

  const { data: apiNotifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !currentUser,
  });

  useNotificationsSocket(currentUser?._id);

  const unreadCount = apiNotifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-gray-100 shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-800">Comments App</div>
      <div className="flex space-x-4">
        {reduxAuth ? (
          <>
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Profile
            </Link>
            <Link
              href="/notifications"
              className="relative px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
