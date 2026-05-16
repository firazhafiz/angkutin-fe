"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { ForgotPasswordRequest } from "@/types/auth";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (res) => {
      setIsSubmitted(true);
      toast.success("Email Terkirim!", {
        description: res.message,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengirim link reset password";
      toast.error("Terjadi Kesalahan", {
        description: message,
      });
    },
  });

  const onSubmit = (data: ForgotPasswordRequest) => {
    mutate(data);
  };

  if (isSubmitted) {
    return (
      <AuthWrapper
        leftTitle="Check your inbox! We've sent you a link to reset your password."
        leftSubtitle="Reset link sent"
      >
        <div className="w-full text-left py-5">
          <h2 className="text-3xl font-bold text-dark mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            We've sent a password reset link to your email address. Please
            follow the instructions in the email to reset your password.
          </p>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full" size="lg" variant="secondary">
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      leftTitle="Don't worry! It happens to the best of us. Let's get you back in."
      leftSubtitle="Reset your password"
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-sm">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Your Email"
            type="email"
            placeholder="Enter your email"
            className="text-dark"
            {...register("email", { required: "Email wajib diisi" })}
            error={errors.email?.message}
          />

          <Button
            className="w-full mt-2 cursor-pointer"
            size="lg"
            variant="secondary"
            isLoading={isPending}
            type="submit"
          >
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </AuthWrapper>
  );
}
