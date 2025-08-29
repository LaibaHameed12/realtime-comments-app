"use client";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "@/redux/slices/notifications/notificationsApi";
import { useEffect } from "react";
import { socket } from "../page";
import Link from "next/link";

const NotificationsPage = () => {

  // RTK Query hooks
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  // Handle mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Handle delete single notification
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  // Handle delete all notifications
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete all notifications", err);
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    await Promise.all(
      notifications.filter((n) => !n.read).map((n) => markAsRead(n._id).unwrap())
    );
    refetch();
  };

  // Live updates with socket
  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        refetch();
      });
    }
  }, [socket]);

  return (
<div className="max-w-xl mx-auto mt-4 sm:mt-6 bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-blue-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={'/'}
              className="cursor-pointer p-2 bg-slate-600/30 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 border border-slate-500/20 hover:border-slate-400/40 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Go to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
              <span className="bg-blue-500/20 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {notifications.filter((n) => !n.read).length}
              </span>
            </h2>
          </div>
          {/* Action buttons */}
          <div className="flex flex-row justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="cursor-pointer px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-blue-400/20 hover:border-blue-400/40 min-h-[44px]"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="cursor-pointer px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-red-400/20 hover:border-red-400/40 min-h-[44px]"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-400 rounded-full opacity-50"></div>
            </div>
            <p className="text-slate-500 text-base sm:text-lg font-medium">No notifications</p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, index) => (
              <div
                key={n._id}
                className={`group relative p-4 sm:p-5 rounded-lg sm:rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  n.read
                    ? "bg-white/70 border-slate-200/50 hover:bg-white"
                    : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200/50 hover:from-blue-50 hover:to-indigo-50 shadow-sm"
                }`}
              >
                {/* Unread indicator */}
                {!n.read && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-0.5 sm:h-16 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                )}

                {/* Notification content */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                      <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                        {n.sender?.username}
                      </span>{" "}
                      <span className="text-slate-600">{n.message}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="cursor-pointer text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 px-3 py-1 rounded-full font-medium transition-all duration-200 border border-blue-200/50 hover:border-blue-300 self-start sm:self-auto"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(n._id)}
                    className="cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Delete notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
