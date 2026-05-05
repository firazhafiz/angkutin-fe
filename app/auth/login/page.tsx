"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard/user");
    } else {
      setIsLoadingCheck(false);
    }
  }, [router]);

  // 1. Setup Form Handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  // 2. Setup Login Mutation (TanStack Query)
  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // SUCCESS LOGGER
      console.log("=== AUTH SUCCESS ===");
      console.log("Token:", data.access_token);
      console.log("User:", data.user);

      // Simpan token (Best Practice)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show proper toast
      toast.success("Login Berhasil!", {
        description: "Mengalihkan ke Dashboard...",
      });
      
      router.push("/dashboard/user");
    },
    onError: (error: any) => {
      // ERROR LOGGER
      console.error("=== AUTH ERROR ===");
      let message =
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.message ||
        "Email atau password salah!";
      
      // If the message is just "Unauthorized", translate it to something more user-friendly
      if (message.toLowerCase() === "unauthorized") {
        message = "Email atau password salah!";
      }
      
      toast.error("Gagal Login", {
        description: message,
      });
    },
  });

  const onSubmit = (data: LoginRequest) => {
    mutate(data);
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
      leftTitle="Welcome back! Let's continue your journey to a cleaner world."
      leftSubtitle="Login to your account"
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Please enter your details to sign in and continue managing your
            waste effectively.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Your Email"
            type="email"
            placeholder="Enter your email"
            className="text-dark"
            {...register("email", { required: "Email wajib diisi" })}
            error={errors.email?.message}
          />
          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              className="text-dark"
              {...register("password", { required: "Password wajib diisi" })}
              error={errors.password?.message}
            />
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            className="w-full mt-2 cursor-pointer"
            size="lg"
            variant="secondary"
            isLoading={isPending}
            type="submit"
          >
            Sign In
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

          <Button
            variant="outline"
            className="w-full flex cursor-pointer items-center gap-2 py-6"
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
            Don't have an account yet?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthWrapper>
  );
}
