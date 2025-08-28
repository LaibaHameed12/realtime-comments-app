// src/pages/register.js
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/validations/authSchema";
import { useRegisterMutation } from "@/redux/slices/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [registerUser] = useRegisterMutation();
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            await registerUser({
                username: data.username,
                email: data.email,
                password: data.password,
            }).unwrap();
            router.push("/login");
        } catch (err) {
            setError(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h1 className="text-xl font-bold mb-4">Register</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                        className="w-full p-2 border rounded"
                    />
                    {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full p-2 border rounded"
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

                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                        className="w-full p-2 border rounded"
                    />
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
