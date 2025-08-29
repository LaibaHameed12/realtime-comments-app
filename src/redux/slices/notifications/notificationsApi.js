import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
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
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => "/notifications",
            providesTags: (result = []) =>
                result.length
                    ? [
                        ...result.map((n) => ({ type: "Notifications", id: n._id || n.id })),
                        { type: "Notifications", id: "LIST" },
                    ]
                    : [{ type: "Notifications", id: "LIST" }],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
        }),
        addNotification: builder.mutation({
            query: (notification) => ({
                url: "/notifications",
                method: "POST",
                body: notification,
            }),
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Notifications", id }],
        }),
        deleteAllNotifications: builder.mutation({
            query: () => ({
                url: `/notifications`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Notifications", id: "LIST" }],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery,
    useMarkAsReadMutation,
    useAddNotificationMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
} = notificationsApi;
