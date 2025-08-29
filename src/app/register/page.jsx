// src/pages/register.js
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/validations/authSchema";
import { useRegisterMutation } from "@/redux/slices/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Home, LogIn } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [registerUser, {isLoading}] = useRegisterMutation();
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-sm sm:max-w-md">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <button
                        onClick={() => (window.location.href = "/")}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer group"
                    >
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Home</span>
                    </button>
                </div>

                {/* Signup Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded"></div>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-slate-600 mt-2 text-sm sm:text-base">Join us today</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                {...register("username", { required: "Username is required" })}
                                className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
                            />
                            {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords don't match",
                                })}
                                className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full min-h-[44px] sm:min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Navigation Links */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            <span>Already have an account?</span>
                            <Link
                                href={'/login'}
                                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer hover:underline"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
