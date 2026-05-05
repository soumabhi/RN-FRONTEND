import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/appStore';

function StatCard({ label, value, sub, accent }) {
    return (
        <div className="card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80,
                background: accent || 'var(--accent-light)',
                borderRadius: '0 0 0 80px',
                opacity: .6,
            }} />
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                {label}
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {value}
            </p>
            {sub && (
                <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 6 }}>{sub}</p>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const { apps, fetchApps, loading } = useAppStore();

    useEffect(() => {
        fetchApps();
    }, []);

    const platforms = [...new Set(apps.flatMap((a) => a.platforms || []))];

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: 13.5, color: 'var(--text-3)' }}>
                    Overview of your OTA update platform
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                <StatCard
                    label="Total Apps"
                    value={apps.length}
                    sub={apps.length === 1 ? '1 app registered' : `${apps.length} apps registered`}
                    accent="rgba(37,99,235,.07)"
                />
                <StatCard
                    label="Platforms"
                    value={platforms.length === 0 ? '—' : platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' & ')}
                    sub="Supported platforms"
                    accent="rgba(16,185,129,.06)"
                />
                <StatCard
                    label="System Status"
                    value={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20 }}>
                            <span style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: 'var(--success)',
                                display: 'inline-block',
                                boxShadow: '0 0 0 3px rgba(16,185,129,.2)',
                            }} />
                            Online
                        </span>
                    }
                    sub="All systems operational"
                    accent="rgba(16,185,129,.06)"
                />
            </div>

            {/* Recent apps */}
            <div className="card">
                <div style={{
                    padding: '18px 24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Your Apps</h2>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Recently registered applications</p>
                    </div>
                    <Link to="/apps" style={{
                        fontSize: 13, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        View all
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                        Loading apps...
                    </div>
                ) : apps.length === 0 ? (
                    <div style={{ padding: '56px 40px', textAlign: 'center' }}>
                        <div style={{
                            width: 48, height: 48,
                            background: 'var(--bg-muted)',
                            borderRadius: 12,
                            margin: '0 auto 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                <line x1="12" y1="18" x2="12.01" y2="18" />
                            </svg>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>No apps yet</p>
                        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>Register your first app to start shipping OTA updates.</p>
                        <Link to="/apps" className="btn btn-primary btn-sm">
                            + Create App
                        </Link>
                    </div>
                ) : (
                    <div>
                        {apps.slice(0, 5).map((app, i) => (
                            <Link
                                key={app._id}
                                to={`/apps/${app._id}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 24px',
                                    borderBottom: i < Math.min(apps.length, 5) - 1 ? '1px solid var(--border)' : 'none',
                                    textDecoration: 'none',
                                    transition: 'background .12s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 36, height: 36,
                                        borderRadius: 9,
                                        background: `hsl(${(app.name.charCodeAt(0) * 37) % 360}, 65%, 92%)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, fontWeight: 700,
                                        color: `hsl(${(app.name.charCodeAt(0) * 37) % 360}, 55%, 38%)`,
                                        flexShrink: 0,
                                    }}>
                                        {app.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 2 }}>{app.name}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{app.appId}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    {app.platforms?.map((p) => (
                                        <span key={p} className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{p}</span>
                                    ))}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

