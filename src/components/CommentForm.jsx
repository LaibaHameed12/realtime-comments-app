"use client";

import { ArrowUpRightFromSquare } from "lucide-react";
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
            {currentUser ? (
                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border border-slate-200/60 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 backdrop-blur-sm flex flex-col gap-3 sm:gap-4 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300"
                >
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg">
                            {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-600 text-xs sm:text-sm">
                            Commenting as{" "}
                            <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {currentUser.username}
                            </span>
                        </span>
                    </div>

                    <div className="relative">
                        <textarea
                            {...register("comment", { required: "Comment cannot be empty" })}
                            className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none placeholder:text-slate-400 shadow-sm"
                            rows={3}
                            placeholder="Share your thoughts..."
                        />
                    </div>

                    {errors.comment && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                !
                            </div>
                            {errors.comment.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="group self-end relative px-4 sm:px-6 py-2.5 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 ease-out overflow-hidden min-h-[44px] cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                            <span className="hidden sm:inline">Post Comment</span>
                            <span className="sm:hidden">Post</span>
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                                <ArrowUpRightFromSquare/>
                            </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                </form>
            ) : (
                <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/60 rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-lg sm:text-2xl">👤</span>
                    </div>
                    <p className="text-slate-600 font-medium text-sm sm:text-base">Please log in to post a comment.</p>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Join the conversation and share your thoughts</p>
                </div>
            )}
        </>
    );
};

export default CommentForm;
