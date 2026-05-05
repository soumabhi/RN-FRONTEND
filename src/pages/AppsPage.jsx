import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import useAppStore from '../store/appStore';

export default function AppsPage() {
    const { apps, fetchApps, createApp, deleteApp, loading, error, clearError } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [appId, setAppId] = useState('');
    const [platforms, setPlatforms] = useState(['android']);

    useEffect(() => { fetchApps(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const app = await createApp(name, appId, platforms);
        if (app) {
            setShowModal(false);
            setName('');
            setAppId('');
            setPlatforms(['android']);
        }
    };

    const togglePlatform = (p) => {
        setPlatforms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const handleDelete = async (id, appName) => {
        if (window.confirm(`Delete "${appName}"? This cannot be undone.`)) {
            await deleteApp(id);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Apps</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                        {apps.length} app{apps.length !== 1 ? 's' : ''} registered
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New App
                </button>
            </div>

            {error && (
                <div onClick={clearError} style={{
                    background: 'var(--error-bg)', border: '1px solid #FECACA',
                    color: 'var(--error)', borderRadius: 'var(--radius)',
                    padding: '10px 14px', fontSize: 13, marginBottom: 16, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Apps table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '56px 24px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                        Loading apps...
                    </div>
                ) : apps.length === 0 ? (
                    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 14,
                            background: 'var(--bg-muted)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-3)' }}>
                                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>No apps yet</p>
                        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Create your first app to start deploying OTA updates.</p>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Create App
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>App ID</th>
                                    <th>API Key</th>
                                    <th>Platforms</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app) => {
                                    const hue = (app.name.charCodeAt(0) * 37) % 360;
                                    return (
                                        <tr key={app._id}>
                                            <td>
                                                <Link to={`/apps/${app._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                                                    <div style={{
                                                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                                        background: `hsl(${hue}, 65%, 92%)`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 13, fontWeight: 700,
                                                        color: `hsl(${hue}, 55%, 38%)`,
                                                    }}>
                                                        {app.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 13.5 }}>
                                                        {app.name}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td>
                                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-2)', background: 'var(--bg-subtle)', padding: '3px 7px', borderRadius: 5 }}>
                                                    {app.appId}
                                                </code>
                                            </td>
                                            <td>
                                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-3)', background: 'var(--bg-subtle)', padding: '3px 7px', borderRadius: 5 }}>
                                                    {app.apiKey?.slice(0, 18)}••••
                                                </code>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                    {app.platforms?.map((p) => (
                                                        <span key={p} className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{p}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(app._id, app.name)}
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ color: 'var(--error)', borderColor: 'transparent', fontSize: 12 }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--error-bg)'; e.currentTarget.style.borderColor = '#FECACA'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create modal */}
            {showModal && createPortal(
                <div
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 50,
                        background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 20,
                    }}
                >
                    <div style={{
                        background: '#fff', borderRadius: 'var(--radius-lg)',
                        width: '100%', maxWidth: 440,
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'slideIn .2s ease',
                    }}>
                        {/* Modal header */}
                        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Create New App</h2>
                                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Configure your app for OTA updates</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'var(--bg-muted)', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '5px', borderRadius: 7, lineHeight: 0, marginTop: 2 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreate} style={{ padding: '18px 24px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                    App Name <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                    placeholder="My App"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                    App ID <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    pattern="[a-z0-9-]+"
                                    value={appId}
                                    onChange={(e) => setAppId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="input"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                    placeholder="my-app"
                                />
                                <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>Lowercase letters, numbers, and hyphens only</p>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 8 }}>Platforms</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[{ id: 'android', label: 'Android', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" /><path d="M19 16h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1" /><rect x="7" y="2" width="10" height="20" rx="2" /></svg> }, { id: 'ios', label: 'iOS', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7c-3 0-4 3-4 5.5 0 3 1 7 3 7 1.5 0 2-1 3-1s1.5 1 3 1c2 0 3-4 3-7 0-2.5-1-5.5-4-5.5-1 0-1.5.5-2 .5S10 7 9 7z" /><path d="M12 4a2 2 0 0 0 2-2 2 2 0 0 0-2 2" /></svg> }].map(({ id, label, icon }) => {
                                        const checked = platforms.includes(id);
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => togglePlatform(id)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 7,
                                                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                                                    border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                                                    background: checked ? 'var(--accent-light)' : 'var(--bg-subtle)',
                                                    color: checked ? 'var(--accent)' : 'var(--text-2)',
                                                    fontSize: 13, fontWeight: 500, transition: 'all .15s',
                                                    fontFamily: 'var(--font-sans)',
                                                }}
                                            >
                                                {icon}
                                                {label}
                                                {checked && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 4 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1, padding: '11px 0', borderRadius: 10,
                                        background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                                        color: 'var(--text-2)', fontSize: 13.5, fontWeight: 600,
                                        cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all .15s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || platforms.length === 0}
                                    style={{
                                        flex: 1, padding: '11px 0', borderRadius: 10,
                                        background: platforms.length === 0 ? 'var(--bg-muted)' : 'var(--accent)',
                                        border: 'none', color: platforms.length === 0 ? 'var(--text-3)' : '#fff',
                                        fontSize: 13.5, fontWeight: 600, cursor: platforms.length === 0 ? 'not-allowed' : 'pointer',
                                        fontFamily: 'var(--font-sans)', transition: 'all .15s',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                        boxShadow: platforms.length > 0 ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                                    }}
                                    onMouseEnter={(e) => { if (platforms.length > 0 && !loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
                                    onMouseLeave={(e) => { if (platforms.length > 0) e.currentTarget.style.background = 'var(--accent)'; }}
                                >
                                    {loading ? (
                                        <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Create App
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                , document.body)}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
