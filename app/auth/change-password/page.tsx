"use client";

import React from "react";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ChangePasswordPage() {
  return (
    <AuthWrapper
      leftTitle="Create a strong password to keep your account secure."
      leftSubtitle="Secure your account"
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">Change Password</h2>
          <p className="text-gray-500 text-sm">
            Please enter your new password below. Make sure it's strong and
            unique to protect your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            className="text-dark"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            className="text-dark"
          />

          <Button className="w-full mt-2" size="lg" variant="secondary">
            Update Password
          </Button>
        </form>
      </div>
    </AuthWrapper>
  );
}
