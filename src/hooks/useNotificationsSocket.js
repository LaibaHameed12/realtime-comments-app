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
}
