"use client";

import CommentItem from "./CommentItem";
import { Loader } from "./Loader";

const CommentsList = ({ currentUserId, comments, isLoading, isError, refetch }) => {
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  if (isLoading) return <Loader />
  if (isError) return <p className="text-center mt-6 text-red-500">Failed to load comments.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-2">
      {sortedComments.length > 0 ? (sortedComments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} currentUserId={currentUserId} refetch={refetch} />
      ))) : <p>no comments yet </p>}
    </div>
  );
};

export default CommentsList;
