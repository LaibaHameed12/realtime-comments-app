import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsApi } from "../redux/slices/comments/commentsApi";
import { notificationsApi } from "../redux/slices/notifications/notificationsApi";
import { socket } from "@/app/page";
import { setComments } from "@/redux/slices/comments/commentsSlice";

export function useNotificationsSocket(userId) {
  const dispatch = useDispatch();

  const comments = useSelector((store) => store.comments.comments)

  console.log("socket::::", socket)

  useEffect(() => {
    if (socket) {


      // socket.emit("register", userId);

      // 🔔 Notifications
      socket.on("notification", (notification) => {
        dispatch(
          notificationsApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            draft.unshift(notification);
          })
        );
      });

      // 💬 New comment
      socket.on("commentCreated", (newComment) => {
        // dispatch(
        //   commentsApi.util.updateQueryData("getComments", undefined, (draft) => {
        //     draft.push(newComment);
        //   })
        // );
        // setComments([...comments ,newComment])
      });

      // ↩️ Reply
      socket.on("replyCreated", (newReply) => {
        dispatch(
          commentsApi.util.updateQueryData("getComments", undefined, (draft) => {
            const parent = draft.find((c) => c._id === newReply.parentComment);
            if (parent) parent.replies.push(newReply);
          })
        );
      });

      // 👍👎 Like / Dislike
      socket.on("commentUpdated", (updatedComment) => {
        dispatch(
          commentsApi.util.updateQueryData("getComments", undefined, (draft) => {
            const index = draft.findIndex((c) => c._id === updatedComment._id);
            if (index !== -1) draft[index] = updatedComment;
          })
        );
      });
    }
  }, [socket]);
}
