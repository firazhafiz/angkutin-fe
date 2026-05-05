import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Konsultasi — Angkutin",
  description:
    "Konsultasikan kebutuhan pengelolaan sampah Anda bersama tim ahli Angkutin.",
};

const faqs = [
  {
    q: "Bagaimana cara memulai layanan angkut sampah?",
    a: "Daftar akun di aplikasi Angkutin, pilih jadwal penjemputan, dan kurir kami akan datang ke lokasi Anda sesuai waktu yang ditentukan.",
  },
  {
    q: "Area mana saja yang sudah dilayani Angkutin?",
    a: "Saat ini kami melayani wilayah Kota Bandung dan sekitarnya. Kami terus memperluas jangkauan layanan secara bertahap.",
  },
  {
    q: "Apa saja jenis sampah yang bisa diangkut?",
    a: "Kami menerima sampah organik, anorganik, dan sampah daur ulang. Untuk limbah B3 (Bahan Berbahaya dan Beracun), harap hubungi tim kami terlebih dahulu.",
  },
  {
    q: "Bagaimana sistem poin dan reward bekerja?",
    a: "Setiap kilogram sampah yang Anda setorkan akan menghasilkan poin. Poin dapat ditukarkan dengan saldo atau voucher di aplikasi.",
  },
];

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary-light rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                Help Center
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Konsultasi
              </h1>
            </div>
          </div>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mt-4">
            Punya pertanyaan? Tim ahli kami siap membantu Anda menemukan solusi
            pengelolaan sampah terbaik.
          </p>
        </div>
      </section>

      {/* Wave */}
      <div className="h-16 bg-primary">
        <svg
          viewBox="0 0 1440 64"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="white" />
        </svg>
      </div>

      {/* Contact Options */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-2xl font-bold text-dark mb-2">Hubungi Kami</h2>
        <p className="text-gray-500 mb-10">
          Pilih cara yang paling mudah untuk Anda.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Phone,
              label: "Telepon",
              value: "+62 823 326 768 48",
              sub: "Senin–Jumat, 08.00–17.00 WIB",
              href: "tel:+6282332676848",
              color: "bg-primary/5 text-primary border-primary/20",
            },
            {
              icon: Mail,
              label: "Email",
              value: "angkutinwaste@gmail.com",
              sub: "Respon dalam 1×24 jam",
              href: "mailto:angkutinwaste@gmail.com",
              color: "bg-primary/5 text-primary border-primary/20",
            },
            {
              icon: Clock,
              label: "Jam Operasional",
              value: "08.00 – 20.00 WIB",
              sub: "Senin s/d Sabtu",
              href: null,
              color: "bg-primary/5 text-primary border-primary/20",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border p-6 flex flex-col gap-3 ${item.color}`}
            >
              <div className="w-10 h-10 bg-primary-light text-dark rounded-xl flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-base font-bold text-dark hover:text-primary transition-colors block mt-1"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-base font-bold text-dark mt-1">
                    {item.value}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <h2 className="text-2xl font-bold text-dark mb-2">Pertanyaan Umum</h2>
        <p className="text-gray-500 mb-10">
          Temukan jawaban dari pertanyaan yang sering ditanyakan.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-primary/30 transition-colors"
            >
              <h3 className="font-bold text-dark mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
