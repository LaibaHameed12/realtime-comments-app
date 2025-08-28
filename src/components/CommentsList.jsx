"use client";

import CommentItem from "./CommentItem";
import { useGetCommentsQuery } from "@/redux/slices/comments/commentsApi";
import { Loader } from "./Loader";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setComments } from "@/redux/slices/comments/commentsSlice";

const CommentsList = ({ currentUserId }) => {
  const { data = [], isLoading, isError } = useGetCommentsQuery();
  const comments = useSelector((store) => store.comments.comments)
  // useNotificationsSocket(currentUserId);


  console.log("data::::", comments)
  
  useEffect(() => {
    if (data) setComments(data)
    }, [data])
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  if (isLoading) return <Loader />
  if (isError) return <p className="text-center mt-6 text-red-500">Failed to load comments.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-2">
      {sortedComments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

export default CommentsList;
