"use client";

import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import { getUser } from "@/redux/slices/auth/authSlice";
import { useCreateCommentMutation, useGetCommentsQuery } from "@/redux/slices/comments/commentsApi";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useGetNotificationsQuery } from "@/redux/slices/notifications/notificationsApi";

export let socket = null;
export default function Home() {
  const userId = useSelector(getUser);
  const [createComment] = useCreateCommentMutation();
  const { data: comments = [], isLoading, isError, refetch } = useGetCommentsQuery();

  useEffect(() => {
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
          socket.off("commentCreated");
          socket.off("replyCreated");
          socket.off("likeNotification");
          socket.off("dislikeNotification");
          socket.off("followNotification");
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [userId?._id])

  const handleAddComment = async (data) => {
    if (!userId) return alert("You must be logged in to comment");
    try {
      await createComment(data.content).unwrap();
      refetch()
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const { data: apiNotifications = [], refetch: refetchNotification } = useGetNotificationsQuery(undefined, {
    skip: !userId,
  });

  useEffect(() => {
    if (socket) {
      socket.on('commentCreated', () => {
        refetchNotification();
        refetch()
      })
    }
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.on("replyCreated", () => {
        refetchNotification();
        refetch();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("likeNotification", () => {
        refetchNotification();
        refetch();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("dislikeNotification", () => {
        refetchNotification();
        refetch()
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("followNotification", () => {
        refetchNotification();
        refetch();
      });
    }
  }, [socket]);

  return (
    <>
      <Navbar apiNotifications={apiNotifications} />
      <div className="max-w-xl mx-auto mt-6 space-y-6">
        <CommentForm currentUser={userId} onSubmit={handleAddComment} />
        <CommentsList currentUserId={userId?._id} comments={comments} isLoading={isLoading} isError={isError} refetch={refetch} />
      </div>
    </>
  );
}
