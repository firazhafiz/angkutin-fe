import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angkutin — Kelola Sampah, Dapatkan Poin",
  description: "Akses penjemputan sampah instan, cek nilai sampah daur ulang, dan pantau dampak positif Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* menghapus flex flex-col di body agar tidak memaksa tinggi yang tidak diperlukan */}
      <body className="min-h-full">
        {/* AuthProvider membungkus seluruh app agar useAuth() bisa dipakai di halaman mana pun */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
