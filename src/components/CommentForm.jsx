"use client";

import React from "react";
import { useForm } from "react-hook-form";

const CommentForm = ({ currentUser, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const submitHandler = (data) => {
        if (!currentUser) return; // safety
        onSubmit({
            author: currentUser.username,
            content: data.comment,
        });
        reset();
    };

    // Render nothing until we have currentUser to avoid hydration mismatch
    if (!currentUser) return null;

    return (
        <>
            {
                currentUser ? (
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="border p-3 rounded-xl shadow-sm bg-white flex flex-col gap-3"
                    >
                        <div className="text-sm text-gray-700">
                            Commenting as{" "}
                            <span className="font-semibold">{currentUser.username}</span>
                        </div>

                        <textarea
                            {...register("comment", { required: "Comment cannot be empty" })}
                            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Write a comment..."
                        />
                        {errors.comment && (
                            <span className="text-red-500 text-xs">{errors.comment.message}</span>
                        )}

                        <button
                            type="submit"
                            className="cursor-pointer self-end bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
                        >
                            Post
                        </button>
                    </form>
                ) : <p className="text-center text-gray-500">Please log in to post a comment.</p>
            }
        </>

    );
};

export default CommentForm;
