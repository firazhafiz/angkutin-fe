'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  // ── State form ────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // State untuk show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  // Error validasi sisi klien
  const [clientError, setClientError] = useState<string | null>(null);

  // ── Handle submit ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    // Validasi password cocok
    if (password !== repeatPassword) {
      setClientError('Password tidak cocok. Silakan periksa kembali.');
      return;
    }

    // Validasi panjang password minimal 8 karakter
    if (password.length < 8) {
      setClientError('Password minimal 8 karakter.');
      return;
    }

    try {
      // await register({ name, email, password });
      // Setelah register berhasil, arahkan ke halaman login
      router.push('/auth/login');
    } catch {
      // error dari hook sudah di-set di state `error`
    }
  };

  const displayError = clientError ?? error;

  // ── Tampilan ─────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* ───── KIRI: Gradient Card ───── */}
      <div style={styles.leftPanel}>
        <Image
          src="/logo/trash-white.svg"
          alt="Angkutin logo"
          width={52}
          height={52}
          style={{ position: 'absolute', top: 32, left: 32 }}
        />
        <div style={styles.leftContent}>
          <p style={styles.leftTagline}>Turn your waste into economic assets easily</p>
          <h2 style={styles.leftHeading}>
            Join now to manage waste smarter and get points or cash balances directly.
          </h2>
        </div>
      </div>

      {/* ───── KANAN: Form Register ───── */}
      <div style={styles.rightPanel}>
        <Image src="/logo/trash-green.svg" alt="Angkutin" width={40} height={40} />

        <h1 style={styles.title}>Create an Account</h1>
        <p style={styles.subtitle}>
          Access instant waste pickup, check the value of recyclable waste, and monitor your
          positive impact on the environment in one place.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Fullname */}
          <Input
            label="Fullname"
            type="text"
            placeholder="Muhammad Ilham"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <Input
            label="Your Email"
            type="email"
            placeholder="muhammadilham@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="• • • • • • • • • •"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            rightIcon={
              <span onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            }
          />

          {/* Repeat Password */}
          <Input
            label="Repeat Password"
            type={showRepeat ? 'text' : 'password'}
            placeholder="• • • • • • • • • •"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            rightIcon={
              <span onClick={() => setShowRepeat((v) => !v)}>
                {showRepeat ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            }
          />

          {/* Pesan error */}
          {displayError && <p style={styles.errorText}>{displayError}</p>}

          {/* Tombol Register */}
          <Button type="submit" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Register Now'}
          </Button>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Google Button */}
          <Button type="button" variant="outline">
            {/* Inline SVG Google logo */}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Google
            </span>
          </Button>
        </form>

        {/* Link ke Login */}
        <p style={styles.bottomText}>
          Already have an account?{' '}
          <Link href="/auth/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Inline styles — mudah dibaca & tidak perlu file CSS terpisah
// ──────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '64px',
    padding: '40px 24px',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff',
  },
  // ── Kiri ─────────────────────────────────────────────
  leftPanel: {
    position: 'relative',
    width: '420px',
    minHeight: '580px',
    borderRadius: '24px',
    background: 'linear-gradient(160deg, #b2dfdb 0%, #4caf82 40%, #2e7d52 100%)',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-end',
    padding: '32px',
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  leftTagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
    margin: 0,
  },
  leftHeading: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.35,
    margin: 0,
  },
  // ── Kanan ─────────────────────────────────────────────
  rightPanel: {
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0d0d0d',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b6b6b',
    lineHeight: 1.6,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '4px',
  },
  errorText: {
    color: '#e53935',
    fontSize: '13px',
    margin: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: '13px',
    color: '#9e9e9e',
    whiteSpace: 'nowrap',
  },
  bottomText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b6b6b',
    margin: '8px 0 0',
  },
  link: {
    color: '#1a9e7a',
    fontWeight: 700,
    textDecoration: 'none',
  },
};

/**
 * 👉 Practice Zone — coba ini sendiri:
 * 1. Tambahkan validasi: email harus mengandung "@" dan "."
 * 2. Tampilkan kekuatan password (lemah / sedang / kuat) di bawah field Password
 * 3. Setelah register berhasil, tampilkan Toast sukses sebelum redirect
 */
