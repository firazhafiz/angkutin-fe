import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shortId = id.slice(0, 8).toUpperCase();
  return {
    title: `Riwayat Misi #${shortId} | Angkutin Courier`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
