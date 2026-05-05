import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan — Angkutin",
  description: "Baca syarat dan ketentuan penggunaan layanan Angkutin.",
};

const sections = [
  {
    title: "1. Penerimaan Syarat",
    content:
      "Dengan mengakses atau menggunakan layanan Angkutin, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, Anda tidak diperbolehkan menggunakan layanan kami.",
  },
  {
    title: "2. Deskripsi Layanan",
    content:
      "Angkutin menyediakan platform pengelolaan sampah digital yang menghubungkan pengguna dengan kurir pengangkut sampah terlatih. Layanan mencakup penjadwalan pengangkutan, pemilahan sampah, dan sistem poin reward berbasis daur ulang.",
  },
  {
    title: "3. Pendaftaran Akun",
    content:
      "Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi. Setiap aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. Anda wajib segera memberitahu kami jika ada penggunaan akun yang tidak sah.",
  },
  {
    title: "4. Penggunaan Layanan yang Diizinkan",
    content:
      "Anda setuju untuk menggunakan layanan Angkutin hanya untuk tujuan yang sah dan sesuai dengan peraturan perundang-undangan yang berlaku. Anda tidak boleh menggunakan layanan kami untuk menyetor limbah berbahaya (B3) tanpa pemberitahuan dan izin terlebih dahulu.",
  },
  {
    title: "5. Sistem Poin dan Reward",
    content:
      "Poin diperoleh berdasarkan jumlah dan jenis sampah yang disetorkan. Nilai poin ditentukan sepenuhnya oleh Angkutin dan dapat berubah sewaktu-waktu dengan pemberitahuan sebelumnya. Poin tidak dapat dipindahtangankan dan memiliki masa berlaku.",
  },
  {
    title: "6. Pembatasan Tanggung Jawab",
    content:
      "Angkutin tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan. Tanggung jawab kami tidak melebihi biaya yang telah Anda bayarkan untuk layanan dalam periode tiga bulan terakhir.",
  },
  {
    title: "7. Perubahan Syarat",
    content:
      "Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan yang signifikan akan diberitahukan melalui aplikasi atau email. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap syarat baru.",
  },
  {
    title: "8. Penghentian Layanan",
    content:
      "Kami berhak menangguhkan atau menghentikan akun Anda jika Anda melanggar syarat dan ketentuan ini. Anda juga dapat menghentikan penggunaan layanan kapan saja dengan menghapus akun Anda melalui aplikasi.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Hero */}
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
                Syarat & Ketentuan
              </h1>
            </div>
          </div>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mt-4">
            Harap baca dengan seksama sebelum menggunakan layanan Angkutin.
          </p>
          <p className="text-white/50 text-sm mt-3">
            Terakhir diperbarui: 1 Mei 2025
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

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-16 pb-24">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full bg-primary/20 group-hover:bg-primary rounded-full transition-colors shrink-0 mt-1.5 self-stretch min-h-4" />
                <div>
                  <h2 className="text-lg font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
              {i < sections.length - 1 && (
                <hr className="mt-8 border-gray-100" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center">
          <p className="text-dark font-bold mb-2">
            Ada pertanyaan tentang syarat ini?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Tim kami siap membantu menjelaskan lebih lanjut.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Hubungi Tim Kami
          </Link>
        </div>
      </section>
    </main>
  );
}
