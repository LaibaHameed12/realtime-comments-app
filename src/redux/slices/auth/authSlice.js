// src/redux/slices/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const isBrowser = typeof window !== "undefined";

const initialState = {
    user: isBrowser ? JSON.parse(localStorage.getItem("user")) : null,
    token: isBrowser ? localStorage.getItem("token") : null,
    socket: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user || null;

            if (isBrowser) {
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user || null));
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;

            if (isBrowser) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        },
        setWebsocket: (state, action) => {
            console.log("action::::", action)
            state.socket = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
            state.token = payload.token;
            state.user = payload.user || null;

            if (isBrowser) {
                localStorage.setItem("token", payload.token);
                localStorage.setItem("user", JSON.stringify(payload.user || null));
            }
        });
    },
});

export const { setCredentials, logout, setWebsocket } = authSlice.actions;
export default authSlice.reducer;

// selectors
export const getUser = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;
export const isAuthenticated = (state) => !!state.auth.token;
