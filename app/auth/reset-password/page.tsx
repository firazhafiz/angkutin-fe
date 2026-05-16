"use client";

import React, { Suspense } from "react";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { ResetPasswordRequest } from "@/types/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordRequest>({
    defaultValues: {
      token: token || "",
      email: email || "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Password Berhasil Diubah!", {
        description: "Silakan login kembali dengan password baru Anda.",
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengubah password";
      toast.error("Gagal Reset Password", {
        description: message,
      });
    },
  });

  const onSubmit = (data: ResetPasswordRequest) => {
    if (!data.token || !data.email) {
      toast.error("Invalid Request", {
        description: "Token atau email tidak ditemukan.",
      });
      return;
    }

    // Only send the fields the backend expects
    const { newPassword_confirmation, ...payload } = data;
    mutate(payload as any);
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-dark mb-4">Password Reset!</h2>
        <p className="text-gray-500 text-sm mb-8">
          Your password has been successfully reset. Redirecting you to login
          page in a few seconds...
        </p>
        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={() => router.push("/auth/login")}
        >
          Back to Login
        </Button>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="w-full text-center py-10">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-dark mb-4">Invalid Link</h2>
        <p className="text-gray-500 text-sm mb-8">
          The password reset link is invalid or has expired. Please request a
          new reset link.
        </p>
        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={() => router.push("/auth/forgot-password")}
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dark mb-2">Create New Password</h2>
        <p className="text-gray-500 text-sm">
          Set your new password to regain access to your account.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("token")} />
        <input type="hidden" {...register("email")} />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          className="text-dark"
          {...register("newPassword", {
            required: "Password baru wajib diisi",
            minLength: {
              value: 8,
              message: "Password minimal 8 karakter",
            },
          })}
          error={errors.newPassword?.message}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          className="text-dark"
          {...register("newPassword_confirmation", {
            required: "Konfirmasi password wajib diisi",
            validate: (val) => {
              if (watch("newPassword") !== val) {
                return "Password tidak cocok";
              }
            },
          })}
          error={errors.newPassword_confirmation?.message}
        />

        <Button
          className="w-full mt-2 cursor-pointer"
          size="lg"
          variant="secondary"
          isLoading={isPending}
          type="submit"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthWrapper
      leftTitle="Secure your account with a new strong password."
      leftSubtitle="Set new password"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthWrapper>
  );
}
