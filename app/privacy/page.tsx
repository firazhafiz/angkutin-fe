import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi — Angkutin",
  description: "Pelajari bagaimana Angkutin melindungi data pribadi Anda.",
};

const sections = [
  {
    title: "Informasi yang Kami Kumpulkan",
    items: [
      "Data identitas: nama lengkap, alamat email, nomor telepon.",
      "Data lokasi: alamat penjemputan sampah yang Anda masukkan.",
      "Data transaksi: riwayat setoran sampah, poin, dan penarikan saldo.",
    ],
  },
  {
    title: "Bagaimana Kami Menggunakan Data Anda",
    items: [
      "Memproses dan mengonfirmasi jadwal penjemputan sampah.",
      "Menghitung dan mengkredit poin reward ke akun Anda.",
      "Mengirimkan notifikasi terkait status layanan.",
    ],
  },
  {
    title: "Keamanan Data",
    items: [
      "Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data.",
      "Kata sandi disimpan dalam bentuk hash yang tidak dapat dikembalikan.",
      "Akses ke data pengguna dibatasi hanya untuk personel yang berwenang.",
    ],
  },
  {
    title: "Hak-Hak Anda",
    items: [
      "Hak untuk mengakses data pribadi yang kami simpan tentang Anda.",
      "Hak untuk meminta koreksi data yang tidak akurat.",
      "Hak untuk menghapus akun dan data Anda.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="relative bg-primary overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary-light rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-start gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                Help Center
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Kebijakan Privasi
              </h1>
            </div>
          </div>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mt-4">
            Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi
            Anda.
          </p>
          <p className="text-white/50 text-sm mt-3">
            Terakhir diperbarui: 1 Mei 2025
          </p>
        </div>
      </section>

      <div className="h-16 bg-primary">
        <svg
          viewBox="0 0 1440 64"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="white" />
        </svg>
      </div>

      <section className="max-w-4xl mx-auto px-6 md:px-12 py-16 pb-24">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-dark mb-5 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-3 pl-11">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-gray-500 text-sm md:text-base leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {i < sections.length - 1 && (
                <hr className="mt-12 border-gray-100" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center">
          <p className="text-dark font-bold mb-2">
            Pertanyaan seputar privasi data?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Hubungi kami di{" "}
            <a
              href="mailto:angkutinwaste@gmail.com"
              className="text-primary font-semibold hover:underline"
            >
              angkutinwaste@gmail.com
            </a>
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </main>
  );
}
