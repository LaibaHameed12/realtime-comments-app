import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentsApi = createApi({
    reducerPath: "commentsApi",
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
    tagTypes: ["Comments"],
    endpoints: (builder) => ({
        getComments: builder.query({
            query: () => "/comments",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((c) => ({ type: "Comments", id: c._id })),
                        { type: "Comments", id: "LIST" },
                    ]
                    : [{ type: "Comments", id: "LIST" }],
        }),
        getCommentById: builder.query({
            query: (id) => `/comments/${id}`,
            providesTags: (result, error, id) => [{ type: "Comments", id }],
        }),
        createComment: builder.mutation({
            query: (content) => ({
                url: "/comments",
                method: "POST",
                body: { content },
            }),
        }),
        replyToComment: builder.mutation({
            query: ({ id, content }) => ({
                url: `/comments/${id}/reply`,
                method: "POST",
                body: { content },
            }),
        }),
        likeComment: builder.mutation({
            query: ({ id }) => ({
                url: `/comments/${id}/like`,
                method: "POST",
            }),
        }),
        unlikeComment: builder.mutation({
            query: ({ id }) => ({
                url: `/comments/${id}/unlike`,
                method: "POST",
            }),
        }),
        deleteComment: builder.mutation({
            query: (id) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useGetCommentByIdQuery,
    useCreateCommentMutation,
    useReplyToCommentMutation,
    useLikeCommentMutation,
    useUnlikeCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
