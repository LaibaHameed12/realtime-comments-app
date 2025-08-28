"use client";

import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import { getUser, setWebsocket } from "@/redux/slices/auth/authSlice";
import { useCreateCommentMutation } from "@/redux/slices/comments/commentsApi";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setSelectedNotification } from "@/redux/slices/notifications/notificationsSlice";

export let socket = null;
export default function Home() {
  const userId = useSelector(getUser);
  const [createComment] = useCreateCommentMutation();

  // Real-time updates

  useEffect(() => {
    setSelectedNotification("jkgsjrsgu")
    if (!userId?._id) return;

    if (!socket) {
      socket = io("http://localhost:4000", { auth: { userId: userId?._id } });
      socket.on('connect', () => {
        console.log('A user connected');
      })
    }
    return () => {
      return () => {
        if (socket) {
          socket.off("notification");
          socket.off("commentCreated");
          socket.off("replyCreated");
          socket.off("commentUpdated");
          socket.disconnect();
          socket = null;
        }
      };
    }
    // useNotificationsSocket(currentUser?._id);
  }, [userId?._id])

  const handleAddComment = async (data) => {
    if (!userId) return alert("You must be logged in to comment");
    try {
      await createComment(data.content).unwrap();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-6 space-y-6">
        <CommentForm currentUser={userId} onSubmit={handleAddComment} />
        <CommentsList currentUserId={userId?._id} />
      </div>
    </>
  );
}
