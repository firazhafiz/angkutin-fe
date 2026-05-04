"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  // 1. Setup Form Handling
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      role: "USER",
    },
  });

  const password = watch("password");

  // 2. Setup Register Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log("=== REGISTER SUCCESS ===");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Registration Successful! Redirecting...");
      router.push("/");
    },
    onError: (error: any) => {
      console.error("=== REGISTER ERROR ===");
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      alert(message);
    },
  });

  const onSubmit = (data: RegisterRequest) => {
    // Buang password_confirmation sebelum dikirim ke API
    const { password_confirmation, ...payload } = data;
    mutate(payload as any);
  };

  return (
    <AuthWrapper
      leftTitle="Join now to manage waste smarter and get points or cash balances directly."
      leftSubtitle="Turn your waste into economic assets easily"
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">
            Create an Account
          </h2>
          <p className="text-gray-500 text-sm">
            Access instant waste pickup, check the value of recyclable waste,
            and monitor your positive impact on the environment in one place.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Fullname"
            placeholder="Enter your full name"
            className="text-dark"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="Your Email"
            type="email"
            placeholder="Enter your email"
            className="text-dark"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            className="text-dark"
            {...register("password", { 
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            error={errors.password?.message}
          />
          <Input
            label="Repeat Password"
            type="password"
            placeholder="••••••••"
            className="text-dark"
            {...register("password_confirmation", { 
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            error={errors.password_confirmation?.message}
          />

          <Button 
            className="w-full mt-2 cursor-pointer" 
            size="lg" 
            variant="secondary"
            isLoading={isPending}
            type="submit"
          >
            Register Now
          </Button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-gray-200" />
            <span className="relative bg-white px-4 text-xs text-gray-400 uppercase font-medium">
              or continue with
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 py-6"
            type="button"
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={18}
              height={18}
              className="mr-1"
            />
            Google
          </Button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthWrapper>
  );
}
