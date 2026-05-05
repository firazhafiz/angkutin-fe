"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contacts = [
    {
      icon: Phone,
      label: "Telepon",
      value: "+62 823 326 768 48",
      href: "tel:+6282332676848",
    },
    {
      icon: Mail,
      label: "Email",
      value: "angkutinwaste@gmail.com",
      href: "mailto:angkutinwaste@gmail.com",
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: "Kota Surabaya, Jawa Timur, Indonesia",
      href: null,
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      value: "@angkutin.id",
      href: "https://instagram.com",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      value: "Angkutin",
      href: "https://linkedin.com",
    },
  ];

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
          <div className="flex items-start gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                Help Center
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Kontak Kami
              </h1>
            </div>
          </div>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mt-4">
            Kami senang mendengar dari Anda. Kirimkan pesan atau temukan kami di
            berbagai kanal berikut.
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

      <section className="max-w-5xl mx-auto px-6 md:px-12 py-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-1">Info Kontak</h2>
              <p className="text-gray-500 text-sm">
                Pilih kanal yang paling sesuai untuk Anda.
              </p>
            </div>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200  group"
                >
                  <div className="w-10 h-10 bg-primary-light/80 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <c.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={
                          c.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-dark hover:text-primary transition-colors"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-dark">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-dark mb-1">Kirim Pesan</h2>
            <p className="text-gray-500 text-sm mb-8">
              Isi formulir berikut dan kami akan merespons dalam 1×24 jam.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="text-primary" size={40} />
                </div>
                <h3 className="text-xl font-black text-dark mb-2">
                  Pesan Terkirim!
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Terima kasih telah menghubungi kami. Tim kami akan membalas
                  pesan Anda secepatnya.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-8 px-6 py-3 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Budi Santoso"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@anda.com"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="Apa yang ingin Anda tanyakan?"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-dark focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Ceritakan lebih detail..."
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-dark focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-dark text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Kirim Pesan
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
