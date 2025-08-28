// src/redux/slices/comments/commentsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedComment: null,
    comments: []
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setSelectedComment: (state, action) => {
            state.selectedComment = action.payload;
        },
        clearSelectedComment: (state) => {
            state.selectedComment = null;
        },
        setComments: (state, action) => {
            console.log("action::::", action)
            state.comments = action.payload
        }
    },
});

export const { setSelectedComment, clearSelectedComment, setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
