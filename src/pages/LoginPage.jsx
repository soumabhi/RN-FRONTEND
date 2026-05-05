import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--bg-subtle)',
            fontFamily: 'var(--font-sans)',
        }}>
            {/* Left panel — branding */}
            <div style={{
                width: 420,
                minWidth: 420,
                background: 'var(--accent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 52px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,.08) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 20%, rgba(255,255,255,.06) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }} />

                {/* Logo */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
                        <div style={{
                            width: 40, height: 40,
                            background: 'rgba(255,255,255,.2)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(8px)',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>RN-OTA</span>
                    </div>

                    <h2 style={{ fontSize: 30, fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 16 }}>
                        Ship updates<br />without app stores.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, lineHeight: 1.7 }}>
                        Push JavaScript bundles to your React Native apps instantly — with rollout controls, targeting, and auto-rollback.
                    </p>
                </div>

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        'Instant OTA bundle delivery',
                        'Gradual rollout & targeting',
                        'Auto-rollback on failures',
                        'Real-time event analytics',
                    ].map((f) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 20, height: 20,
                                background: 'rgba(255,255,255,.2)',
                                borderRadius: 6,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 13.5, fontWeight: 450 }}>{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
            }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="animate-fade-in">
                    <div style={{ marginBottom: 36 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                            Sign in to your RN-OTA account
                        </p>
                    </div>

                    {error && (
                        <div onClick={clearError} style={{
                            background: 'var(--error-bg)',
                            border: '1px solid #FECACA',
                            color: 'var(--error)',
                            borderRadius: 'var(--radius)',
                            padding: '10px 14px',
                            fontSize: 13,
                            marginBottom: 20,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: 6 }}>
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>Password</label>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                        >
                            {loading ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginTop: 28 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

