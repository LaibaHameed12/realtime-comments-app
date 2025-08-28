"use client";

import React from "react";
import { useGetCommentsQuery, useDeleteCommentMutation } from "@/redux/slices/comments/commentsApi";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const MyCommentsList = ({ currentUser }) => {
  const { data: comments, isLoading, isError } = useGetCommentsQuery();
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
    <div className="max-w-2xl mx-auto mt-6 space-y-2">
      {myComments.map((comment) => (
        <div key={comment._id} className="border p-3 rounded-xl bg-white shadow flex justify-between items-start">
          <div>
            <p className="text-gray-700">{comment.content}</p>
            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <div className="flex items-center space-x-3 text-sm pb-3">
              <button
                className={`flex gap-2`}
              >
                <ThumbsUp size={20} /> {comment.likes.length}
              </button>

              <button
                className={`flex gap-2`}
              >
                <ThumbsDown size={20} /> {comment.unlikes.length}
              </button>
            </div>
            <button
              onClick={() => handleDelete(comment._id)}
              className="bg-red-500 hover:bg-red-700 text-sm px-3 py-1 rounded-md text-white cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCommentsList;
