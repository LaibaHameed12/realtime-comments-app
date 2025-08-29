"use client";

import React, { useEffect, useState } from "react";
import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useReplyToCommentMutation,
  useDeleteCommentMutation,
} from "@/redux/slices/comments/commentsApi";
import {
  useFollowUserMutation,
  useGetProfileQuery,
  useUnfollowUserMutation,
  useUpdateProfileMutation,
} from "@/redux/slices/users/usersApi";
import { Dot, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import { socket } from "@/app/page";

const CommentItem = ({ comment, currentUserId, refetch }) => {
  const [replyText, setReplyText] = useState("");

  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const [replyToComment] = useReplyToCommentMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { data: currentUser, refetch : ProfileRefetch } = useGetProfileQuery();

  const isFollowing = currentUser?.following?.includes(comment.author._id);
  const hasLiked = comment.likes.includes(currentUserId);
  const hasUnliked = comment.unlikes.includes(currentUserId);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    try {
      if (isFollowing) await unfollowUser(comment.author._id).unwrap();
      else await followUser(comment.author._id).unwrap();
      refetch()
      ProfileRefetch()
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !comment._id) return;
    try {
      await likeComment({ id: comment._id }).unwrap();
      refetch()
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlike = async () => {
    if (!currentUser || !comment._id) return;
    try {
      await unlikeComment({ id: comment._id }).unwrap();
      refetch()
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!currentUser || replyText.trim() === "") return;
    try {
      await replyToComment({ id: comment._id, content: replyText }).unwrap();
      setReplyText("");
      refetch()
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    try {
      await deleteComment(comment._id).unwrap();
      refetch()
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };


  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-60"></div>
      <div className="relative p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex gap-3 sm:gap-4 items-center">
            <div className="relative">
              <img
                src="/user.png"
                alt="Profile"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-base sm:text-lg">{comment.author?.username}</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">{formatTime(comment.createdAt)}</span>
            </div>
          </div>

          {currentUser && currentUserId === comment.author?._id ? (
            <button
              onClick={handleDelete}
              className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base min-h-[44px] cursor-pointer bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md"
            >
              Delete
            </button>
          ) : currentUser && currentUserId !== comment.author?._id ? (
            <button
              onClick={handleFollowToggle}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base min-h-[44px] cursor-pointer ${isFollowing
                ? "bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white shadow-md"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
                }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          ) : null}
        </div>

        {/* Comment */}
        <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100">
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{comment.content}</p>
        </div>

        {/* Like / Unlike */}
        <div className="flex items-center space-x-4 sm:space-x-6 pt-2">
          <button
            onClick={handleLike}
            disabled={!currentUser}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base min-h-[44px] cursor-pointer ${hasLiked
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
              : "bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200"
              }`}
          >
            <ThumbsUp size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-semibold">{comment.likes.length}</span>
          </button>

          <button
            onClick={handleUnlike}
            disabled={!currentUser}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base min-h-[44px] cursor-pointer ${hasUnliked
              ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md"
              : "bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200"
              } `}
          >
            <ThumbsDown size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-semibold">{comment.unlikes.length}</span>
          </button>
        </div>

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-4 sm:mt-6 space-y-3 pl-3 sm:pl-6 border-l-4 border-gradient-to-b from-blue-200 to-indigo-300 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-r-lg sm:rounded-r-xl py-3 sm:py-4 pr-3 sm:pr-4">
            {comment.replies.map((reply) => (
              <div
                key={reply._id}
                className="bg-white/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex gap-2 sm:gap-3 items-center mb-2 sm:mb-3">
                  <img
                    src="/user.png"
                    alt="Profile"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-slate-700 text-sm sm:text-base">{reply.author?.username}</span>
                    <span className="flex items-center text-xs text-slate-500 font-medium">
                      <Dot size={14} className="sm:w-4 sm:h-4" /> replied
                    </span>
                    <span className="text-xs text-slate-400">{formatTime(reply.createdAt)}</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        {currentUser && (
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
            <input
              type="text"
              placeholder="Write a thoughtful reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-sm sm:text-base min-h-[44px]"
            />
            <button
              onClick={handleReply}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base min-h-[44px] cursor-pointer"
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
