"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "@/redux/slices/auth/authSlice";
import { useGetCommentsQuery, useCreateCommentMutation } from "@/redux/slices/comments/commentsApi";
import { useLazyGetNotificationsQuery } from "@/redux/slices/notifications/notificationsApi";
import { io } from "socket.io-client";
import Navbar from "@/components/Navbar";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";

let socket;

export default function Home() {
  const userId = useSelector(getUser);
  const [createComment] = useCreateCommentMutation();

  // comments query
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useGetCommentsQuery();

  // lazy notifications query
  const [triggerNotifications, { data: apiNotifications = [] }] = useLazyGetNotificationsQuery();

  // Trigger notifications query on mount that unread notifiations show 
  useEffect(() => {
  if (userId) {
    triggerNotifications();  
  }
}, [userId]);

  // connect socket
  useEffect(() => {
    if (!userId?._id) return;

    if (!socket) {
      socket = io("http://localhost:4000", {
        auth: { userId: userId._id },
      });

      socket.on("connect", () => {
        console.log("A user connected");
      });
    }

    return () => {
      if (socket) {
        socket.off("commentCreated");
        socket.off("replyCreated");
        socket.off("likeNotification");
        socket.off("dislikeNotification");
        socket.off("followNotification");
        socket.disconnect();
        socket = null;
      }
    };
  }, [userId?._id]);

  // helper: refresh comments + notifications
  const refreshData = () => {
    if (userId) {
      triggerNotifications();
    }
    refetch(); 
  };

  // socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("commentCreated", refreshData);
    socket.on("replyCreated", refreshData);
    socket.on("likeNotification", refreshData);
    socket.on("dislikeNotification", refreshData);
    socket.on("followNotification", refreshData);

    return () => {
      if (socket) {
        socket.off("commentCreated", refreshData);
        socket.off("replyCreated", refreshData);
        socket.off("likeNotification", refreshData);
        socket.off("dislikeNotification", refreshData);
        socket.off("followNotification", refreshData);
      }
    };
  }, [socket, userId]);

  // add comment
  const handleAddComment = async (data) => {
    if (!userId) return alert("You must be logged in to comment");
    try {
      await createComment(data.content).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <>
      <Navbar apiNotifications={apiNotifications} />
      <div className="max-w-xl mx-auto mt-6 space-y-6">
        <CommentForm currentUser={userId} onSubmit={handleAddComment} />
        <CommentsList
          currentUserId={userId?._id}
          comments={comments}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
        />
      </div>
    </>
  );
}
