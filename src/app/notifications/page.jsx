"use client"
import { useSelector } from "react-redux";
import { getUser } from "@/redux/slices/auth/authSlice";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "@/redux/slices/notifications/notificationsApi";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

const NotificationsPage = () => {
  const currentUser = useSelector(getUser);

  // RTK Query is the source of truth
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  // Setup socket updates
  useNotificationsSocket(currentUser?._id);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    await Promise.all(
      notifications.filter(n => !n.read).map(n => markAsRead(n.id).unwrap())
    );
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Notifications ({notifications.filter(n => !n.read).length})</h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-500 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 border-b last:border-none cursor-pointer ${n.read ? "bg-gray-50" : "bg-gray-100"}`}
          >
            <p className="text-sm">{n.message}</p>
            <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="ml-2 text-xs text-blue-500 hover:underline"
              >
                Mark read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
