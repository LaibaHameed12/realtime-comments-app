"use client";

import React, { useEffect, useState } from "react";
import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useReplyToCommentMutation,
} from "@/redux/slices/comments/commentsApi";
import {
  useFollowUserMutation,
  useGetProfileQuery,
  useUnfollowUserMutation,
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

  const { data: currentUser } = useGetProfileQuery();

  const isFollowing = currentUser?.following?.includes(comment.author._id);
  const hasLiked = comment.likes.includes(currentUserId);
  const hasUnliked = comment.unlikes.includes(currentUserId);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    try {
      if (isFollowing) await unfollowUser(comment.author._id).unwrap();
      else await followUser(comment.author._id).unwrap();
      refetch()
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

  return (
    <div className="p-4 border rounded-2xl shadow-sm bg-white space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <img
            src="/user.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{comment.author?.username}</span>
            <span className="text-xs text-gray-500">
              {formatTime(comment.createdAt)}
            </span>
          </div>
        </div>

        {currentUser && currentUserId !== comment.author?._id && (
          <button
            onClick={handleFollowToggle}
            className={`px-3 py-1 rounded-xl text-white cursor-pointer ${isFollowing
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Comment */}
      <p className="text-gray-700">{comment.content}</p>

      {/* Like / Unlike */}
      <div className="flex items-center space-x-3 text-sm pb-3">
        <button
          onClick={handleLike}
          disabled={!currentUser}
          className={`flex gap-2 cursor-pointer ${hasLiked ? "text-blue-600" : ""}`}
        >
          <ThumbsUp size={20} /> {comment.likes.length}
        </button>

        <button
          onClick={handleUnlike}
          disabled={!currentUser}
          className={`flex gap-2 cursor-pointer ${hasUnliked ? "text-red-600" : ""}`}
        >
          <ThumbsDown size={20} /> {comment.unlikes.length}
        </button>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
          {comment.replies.map((reply) => (
            <div
              key={reply._id}
              className="text-gray-700 text-sm border-b border-gray-200 pb-3"
            >
              <div className="flex gap-3 py-2">
                <img
                  src="/user.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold flex">
                    {reply.author?.username}{" "}
                    <span className="flex text-xs font-normal">
                      <Dot /> replied
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(reply.createdAt)}
                  </span>
                </div>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {currentUser && (
        <div className="mt-3 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-1 cursor-pointer"
          />
          <button
            onClick={handleReply}
            className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
