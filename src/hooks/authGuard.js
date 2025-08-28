"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/redux/slices/auth/authSlice";

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const isLoggedIn = useSelector(isAuthenticated);

    // Define route categories
    const publicRoutes = ["/login", "/register"];
    const protectedRoutes = ["/profile"]; 

    useEffect(() => {
        const path = window.location.pathname;

        if (isLoggedIn && publicRoutes.includes(path)) {
            router.replace("/"); 
        } else if (!isLoggedIn && protectedRoutes.includes(path)) {
            router.replace("/login"); 
        }
    }, [isLoggedIn, router]);

    return children;
};

export default AuthGuard;
