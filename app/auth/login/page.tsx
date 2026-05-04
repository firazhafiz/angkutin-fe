'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  // ── State form ────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ── Handle submit ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      // Setelah login berhasil → arahkan ke dashboard yang sesuai
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user');
      }
    } catch {
      // error dari hook sudah di-set di state `error`
    }
  };

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
          <p style={styles.leftTagline}>Welcome Back!</p>
          <h2 style={styles.leftHeading}>
            Keep contributing to a cleaner planet. Your waste today is your balance for tomorrow.
          </h2>
        </div>
      </div>

      {/* ───── KANAN: Form Login ───── */}
      <div style={styles.rightPanel}>
        <Image src="/logo/trash-green.svg" alt="Angkutin" width={40} height={40} />

        <h1 style={styles.title}>Login Account</h1>
        <p style={styles.subtitle}>
          Enter your account details to continue waste collection or withdraw your in-app balance.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <Input
            label="Your Email"
            type="email"
            placeholder="muhammadilham@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password + Forgot Password */}
          <div>
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
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <Link href="/auth/forgot-password" style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Pesan error dari API */}
          {error && <p style={styles.errorText}>{error}</p>}

          {/* Tombol Sign In */}
          <Button type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Sign in Now'}
          </Button>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Google Button */}
          <Button type="button" variant="outline">
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

        {/* Link ke Register */}
        <p style={styles.bottomText}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Inline styles (sama persis dengan Register — konsisten)
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
  forgotLink: {
    fontSize: '13px',
    color: '#6b6b6b',
    textDecoration: 'none',
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
 * 1. Tambahkan validasi format email sebelum submit (cek ada "@" dan ".")
 * 2. Simpan email ke localStorage agar auto-fill saat user kembali buka halaman
 * 3. Tambahkan animasi shake pada form jika login gagal
 */
