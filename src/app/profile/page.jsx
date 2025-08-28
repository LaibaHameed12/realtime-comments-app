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
            {/* Top Buttons */}
            <div className="max-w-2xl mx-auto mt-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                    Back to Home
                </Link>
                <div className="flex space-x-3">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded shadow">
                <div className="flex items-center space-x-6">
                    <img
                        src={user.profilePicture || "/user.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user.username}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="mt-1 text-gray-600">
                            Followers: <span className="font-semibold mr-4">{user.followers?.length || 0}</span>
                            Following: <span className="font-semibold">{user.following?.length || 0}</span>
                        </p>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Bio</h3>
                    {editing ? (
                        <div className="mt-2 flex flex-col space-y-2">
                            <textarea
                                className="border rounded p-2 w-full"
                                rows={4}
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleBioSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setNewBio(user.bio || "");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 flex justify-between items-center">
                            <p className="text-gray-700">{user.bio || "No bio yet."}</p>
                            <button
                                onClick={() => setEditing(true)}
                                className="px-5 py-1 bg-blue-300 text-gray-800 rounded hover:bg-blue-400 text-sm cursor-pointer"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* My Comments */}
            <MyCommentsList currentUser={user} />
        </>
    );
};

export default Profile;
