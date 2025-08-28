"use client";

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./slices/auth/authApi";
import authReducer from "./slices/auth/authSlice";
import { commentsApi } from "./slices/comments/commentsApi";
import commentsReducer from "./slices/comments/commentsSlice";
import { usersApi } from "./slices/users/usersApi";
import { notificationsApi } from "./slices/notifications/notificationsApi";
import notificationsReducer from "./slices/notifications/notificationsSlice";


export const store = configureStore({
    reducer: {
        // RTK Query APIs
        [authApi.reducerPath]: authApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,

        // Normal slices
        auth: authReducer,
        comments: commentsReducer,
        notifications: notificationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            commentsApi.middleware,
            usersApi.middleware,
            notificationsApi.middleware
        ),
});
