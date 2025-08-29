"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/slices/users/usersApi";
import MyCommentsList from "@/components/MyCommentsList";
import { useSelector, useDispatch } from "react-redux";
import { getUser, logout } from "@/redux/slices/auth/authSlice";

const Profile = () => {
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    // Single source of truth: getProfile query
    const { data: user, isLoading, isError, refetch } = useGetProfileQuery(undefined, {
        skip: !token,
    });

    const [updateProfile] = useUpdateProfileMutation();
    const [editing, setEditing] = useState(false);
    const [newBio, setNewBio] = useState("");

    useEffect(() => {
        if (user) setNewBio(user.bio || "");
        else if (!token) router.push("/login");
    }, [user, token]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    const handleBioSave = async () => {
        try {
            await updateProfile({ bio: newBio }).unwrap();
            setEditing(false);
        } catch (err) {
            console.error("Failed to update bio:", err);
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
    if (isError || !user) return <p className="text-center mt-10 text-red-500">Failed to load profile.</p>;

    return (
        <>
            {/* Top Navigation - Enhanced with gradient background and responsive design */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-row justify-between items-center gap-3 sm:gap-0">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-slate-700 rounded-lg sm:rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base min-h-[44px] cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 sm:px-5 py-2.5 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm font-medium hover:shadow-md text-sm sm:text-base min-h-[44px] cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Profile Section - Modern card design with responsive layout */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Profile Header with subtle gradient and responsive design */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                            {/* Avatar with ring and responsive sizing */}
                            <div className="relative">
                                <img
                                    src={user.profilePicture || "/user.png"}
                                    alt="Profile"
                                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl object-cover shadow-lg ring-4 ring-white"
                                />
                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white shadow-sm"></div>
                            </div>

                            {/* User Info - always centered on mobile */}
                            <div className="text-center flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{user.username}</h1>
                                <p className="text-slate-600 mb-4 font-medium text-sm sm:text-base">{user.email}</p>

                                {/* Stats with responsive spacing */}
                                <div className="flex justify-center gap-6 sm:gap-8">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-slate-900">{user.followers?.length || 0}</div>
                                        <div className="text-xs sm:text-sm text-slate-500 font-medium">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-slate-900">{user.following?.length || 0}</div>
                                        <div className="text-xs sm:text-sm text-slate-500 font-medium">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section - Clean and modern with responsive design */}
                    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-slate-100">
                        <div className="flex flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                            <h3 className="text-lg font-semibold text-slate-900">About</h3>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all duration-200 min-h-[44px] cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Edit
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                <textarea
                                    className="w-full px-3 sm:px-4 py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                                    rows={4}
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                />
                                <div className="flex justify-end flex-row gap-3">
                                    <button
                                        onClick={handleBioSave}
                                        className="px-4 sm:px-6 py-2.5 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base min-h-[44px] cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(false)
                                            setNewBio(user.bio || "")
                                        }}
                                        className="px-4 sm:px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium text-sm sm:text-base min-h-[44px] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                                    {user.bio || <span className="text-slate-400 italic">No bio added yet. Click edit to add one!</span>}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments Section Spacer with responsive spacing */}
                <div className="mt-6 sm:mt-8">
                    <MyCommentsList currentUser={user} />
                </div>
            </div>
        </>
    );
};

export default Profile;
