// src/redux/slices/users/usersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Profile", "User"],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => "/users/me",
            providesTags: (result) =>
                result ? [{ type: "Profile", id: result._id }] : ["Profile"],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/users/me",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: "Profile", id: result._id }] : ["Profile"],
        }),
        followUser: builder.mutation({
            query: (targetId) => ({
                url: `/users/follow/${targetId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, targetId) => [
                { type: "Profile", id: "CURRENT" },
                { type: "User", id: targetId },
            ],
        }),
        unfollowUser: builder.mutation({
            query: (targetId) => ({
                url: `/users/unfollow/${targetId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, targetId) => [
                { type: "Profile", id: "CURRENT" },
                { type: "User", id: targetId },
            ],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useFollowUserMutation,
    useUnfollowUserMutation,
} = usersApi;
