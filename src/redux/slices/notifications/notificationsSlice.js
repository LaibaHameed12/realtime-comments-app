// src/redux/slices/notifications/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedNotification: null,
    unreadCount: 0,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setSelectedNotification: (state, action) => {
            console.log("actions  notification::::")
            state.selectedNotification = action.payload;
        },
        clearSelectedNotification: (state) => {
            state.selectedNotification = null;
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
    },
});

export const {
    setSelectedNotification,
    clearSelectedNotification,
    setUnreadCount,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
