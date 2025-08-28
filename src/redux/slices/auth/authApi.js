import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "auth/login",
                method: "POST",
                body,
            }),
            transformResponse: (response) => ({
                token: response.token,
                user: response.user || null,
            }),
        }),

    }),
});

export const { useRegisterMutation, useLoginMutation, useProfileQuery } = authApi;
