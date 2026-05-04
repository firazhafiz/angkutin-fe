import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Angkutin - Smart Waste Management Solution",
    template: "%s | Angkutin",
  },
  description: "Angkutin empowers you to manage daily waste smarter and more sustainably. Join the movement for a cleaner world with our integrated recycling platform.",
  icons: {
    icon: "/logo/trash-white.svg",
    apple: "/logo/trash-white.svg",
  },
  openGraph: {
    title: "Angkutin - Smart Waste Management Solution",
    description: "Manage your waste smarter and more sustainably with Angkutin.",
    url: "https://angkutin-ten.vercel.app/",
    siteName: "Angkutin",
    images: [
      {
        url: "/logo/angkutin_tosca.png",
        width: 1200,
        height: 630,
        alt: "Angkutin Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angkutin - Smart Waste Management Solution",
    description: "Manage your waste smarter and more sustainably with Angkutin.",
    images: ["/logo/angkutin_tosca.png"],
  },
};

import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
