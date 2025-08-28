// src/pages/login.js
"use client";

import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/validations/authSchema";
import { useLoginMutation } from "@/redux/slices/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginMutation()
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await loginUser(data).unwrap();
            dispatch(setCredentials({ token: res.token, user: res.user }));
            router.push("/"); // redirect to home after login
        } catch (err) {
            setError(err?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h1 className="text-xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full p-2 border rounded"
                        autoFocus
                    />

                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full p-2 border rounded"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    disabled={isLoading} // from useLoginMutation
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    )
}

export default Login
