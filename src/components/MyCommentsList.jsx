"use client";

import React from "react";
import { useGetCommentsQuery, useDeleteCommentMutation } from "@/redux/slices/comments/commentsApi";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import CommentItem from "./CommentItem";

const MyCommentsList = ({ currentUser }) => {
  const { data: comments, isLoading, isError, refetch } = useGetCommentsQuery();
  const [deleteComment] = useDeleteCommentMutation();

  if (isLoading) return <p className="text-center mt-6">Loading your comments...</p>;
  if (isError) return <p className="text-center mt-6 text-red-500">Failed to load comments.</p>;
  if (!comments || !currentUser) return null;

  const myComments = comments.filter(c => c.author?._id === currentUser._id);

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (myComments.length === 0) return <p className="text-center mt-6">You haven't posted any comments yet.</p>;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl md:rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden backdrop-blur-sm">
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">My Comments</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1">Your recent activity and contributions</p>
      </div>

      <div className="divide-y divide-slate-100/60">
        {myComments.length > 0 ? (
          myComments.map((comment) => (
            <CommentItem comment={comment} currentUserId={currentUser._id} refetch={refetch} />
            
          ))
        ) : (
          <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No comments yet</h3>
            <p className="text-sm sm:text-base text-slate-500">Start engaging with posts to see your comments here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommentsList;
