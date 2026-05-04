"use client";

import React from "react";
import Link from "next/link";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
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

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Your Email"
            type="email"
            placeholder="Enter your email"
            className="text-dark"
          />

          <Button className="w-full mt-2" size="lg" variant="secondary">
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
