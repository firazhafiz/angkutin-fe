"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "994946458577-ia9m9um81ncsk6qcob2ba4b3l3dl1pm2.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
