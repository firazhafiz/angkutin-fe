"use client";

import { useEffect, useState } from "react";

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
import { toast } from "sonner";
import Cookies from "js-cookie";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Sync to cookies for proxy/middleware if missing
        if (!Cookies.get("token")) {
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("user_role", user.role, { expires: 7 });
        }

        if (user.role === "COURIER") {
          router.replace("/dashboard/courier");
        } else {
          router.replace("/dashboard/user");
        }
      } catch (e) {
        localStorage.clear();
        Cookies.remove("token");
        Cookies.remove("user_role");
        setIsLoadingCheck(false);
      }
    } else {
      // If no token in localStorage, ensure cookies are also gone
      Cookies.remove("token");
      Cookies.remove("user_role");
      setIsLoadingCheck(false);
    }
  }, [router]);

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
    onSuccess: (data: any) => {
      console.log("=== REGISTER SUCCESS ===");
      // Gunakan access_token sesuai dengan struktur API terbaru
      localStorage.setItem("token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      // Simpan di Cookies untuk Middleware (Next.js)
      Cookies.set("token", data.access_token, { expires: 7 });
      Cookies.set("user_role", data.user.role, { expires: 7 });

      toast.success("Registrasi Berhasil!", {
        description: "Selamat datang! Mengalihkan ke Dashboard...",
      });

      if (data.user.role === "COURIER") {
        router.push("/dashboard/courier");
      } else {
        router.push("/dashboard/user");
      }
    },
    onError: (error: any) => {
      console.error("=== REGISTER ERROR ===");
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed. Please try again.";

      toast.error("Registrasi Gagal", {
        description: message,
      });
    },
  });

  const onSubmit = (data: RegisterRequest) => {
    // Buang password_confirmation sebelum dikirim ke API
    const { password_confirmation, ...payload } = data;
    mutate(payload as any);
  };

  if (isLoadingCheck) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
                message: "Invalid email address",
              },
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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
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
              validate: (value) =>
                value === password || "Passwords do not match",
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
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-4 text-xs text-gray-400 uppercase font-medium">
              or continue with
            </span>
          </div>

          <GoogleAuthButton mode="register" />

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
