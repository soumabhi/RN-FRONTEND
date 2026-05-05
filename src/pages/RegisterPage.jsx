import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await register(name, email, password);
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
                background: 'linear-gradient(160deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 52px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(circle at 80% 80%, rgba(255,255,255,.08) 0%, transparent 50%),
                                      radial-gradient(circle at 20% 20%, rgba(255,255,255,.05) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }} />

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
                        <div style={{
                            width: 40, height: 40,
                            background: 'rgba(255,255,255,.2)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>RN-OTA</span>
                    </div>

                    <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 16 }}>
                        Join thousands of<br />React Native teams.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14.5, lineHeight: 1.7 }}>
                        Deploy your first OTA update in minutes. No certificates, no review process, no waiting.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,.1)',
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 12,
                    padding: '18px 20px',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', lineHeight: 1.6 }}>
                        "RN-OTA cut our release cycle from 2 days to 2 minutes. Our users always have the latest version."
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: 'rgba(255,255,255,.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: 'white',
                        }}>A</div>
                        <div>
                            <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>Abhishek K.</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>Mobile Developer</div>
                        </div>
                    </div>
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
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                            Create your account
                        </h1>
                        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                            Get started — it's free forever.
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
                                Full name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                placeholder="Your name"
                            />
                        </div>

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
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: 6 }}>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Minimum 8 characters"
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
                                    Creating account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginTop: 28 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

