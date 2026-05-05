import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

function SectionCard({ title, subtitle, action, children, style }) {
    return (
        <div className="card" style={{ overflow: 'hidden', ...style }}>
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{title}</h2>
                    {subtitle && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

export default function AppDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentApp, fetchApp,
        versions, fetchVersions,
        uploadVersion, updateRollout, rollback,
        loading, error, clearError,
    } = useAppStore();

    const [file, setFile] = useState(null);
    const [version, setVersion] = useState('');
    const [platform, setPlatform] = useState('android');
    const [rolloutVal, setRolloutVal] = useState(100);
    const [segment, setSegment] = useState('all');
    const [minVersion, setMinVersion] = useState('');
    const [maxVersion, setMaxVersion] = useState('');
    const [countries, setCountries] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    useEffect(() => {
        fetchApp(id);
    }, [id]);

    useEffect(() => {
        if (currentApp?.appId) {
            fetchVersions(currentApp.appId);
        }
    }, [currentApp?.appId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append('bundle', file);
        form.append('appId', currentApp.appId);
        form.append('version', version);
        form.append('platform', platform);
        form.append('rollout', rolloutVal);
        form.append('segment', segment);
        if (minVersion) form.append('minVersion', minVersion);
        if (maxVersion) form.append('maxVersion', maxVersion);
        if (countries) form.append('countries', countries.split(',').map(c => c.trim()).join(','));

        const result = await uploadVersion(form);
        setUploading(false);

        if (result) {
            setFile(null);
            setVersion('');
            setMinVersion('');
            setMaxVersion('');
            setCountries('');
            setSegment('all');
            setRolloutVal(100);
            setShowAdvanced(false);
            fetchVersions(currentApp.appId);
        }
    };

    const handleRollback = async () => {
        if (!window.confirm('Rollback to previous version? This takes effect immediately.')) return;
        const result = await rollback(currentApp.appId, platform);
        if (result) {
            fetchVersions(currentApp.appId);
        }
    };

    const handleRolloutChange = async (vId, newRollout) => {
        await updateRollout(vId, newRollout);
    };

    const copyApiKey = () => {
        if (currentApp?.apiKey) {
            navigator.clipboard.writeText(currentApp.apiKey);
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        }
    };

    if (!currentApp && loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--text-3)', fontSize: 13 }}>
                Loading app details...
            </div>
        );
    }

    if (!currentApp) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--text-3)', fontSize: 13 }}>
                App not found.
            </div>
        );
    }

    return (
        <div>
            {/* Back */}
            <button
                onClick={() => navigate('/apps')}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '0 0 18px', fontFamily: 'var(--font-sans)',
                    transition: 'color .15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Apps
            </button>

            {/* App info */}
            <div className="card" style={{ padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 11,
                        background: `hsl(${(currentApp.name.charCodeAt(0) * 37) % 360}, 65%, 92%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, flexShrink: 0,
                        color: `hsl(${(currentApp.name.charCodeAt(0) * 37) % 360}, 55%, 38%)`,
                    }}>
                        {currentApp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                            {currentApp.name}
                        </h1>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>App configuration & deployment</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
                        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>App ID</p>
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-1)', fontWeight: 500 }}>
                            {currentApp.appId}
                        </code>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
                        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Platforms</p>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {currentApp.platforms?.map((p) => (
                                <span key={p} className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{p}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>API Key</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setShowApiKey(!showApiKey)} style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                                    {showApiKey ? 'Hide' : 'Reveal'}
                                </button>
                                {showApiKey && (
                                    <button onClick={copyApiKey} style={{ fontSize: 11, color: copiedKey ? 'var(--success)' : 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, transition: 'color .15s' }}>
                                        {copiedKey ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>
                        </div>
                        {showApiKey ? (
                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', wordBreak: 'break-all', display: 'block' }}>
                                {currentApp.apiKey}
                            </code>
                        ) : (
                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                                {currentApp.apiKey?.slice(0, 16)}••••••••
                            </code>
                        )}
                    </div>
                </div>
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

            {/* Upload form */}
            <SectionCard title="Upload New Bundle" subtitle="Deploy a new OTA bundle to your users" style={{ marginBottom: 20 }}>
                <div style={{ padding: '20px 24px' }}>
                    <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                Bundle File <span style={{ color: 'var(--error)' }}>*</span>
                            </label>
                            <div style={{
                                border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius)',
                                padding: '14px', background: file ? 'var(--accent-light)' : 'var(--bg-subtle)', cursor: 'pointer',
                            }}>
                                <input
                                    type="file"
                                    accept=".js,.bundle"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                    style={{ width: '100%', fontSize: 12.5, color: 'var(--text-2)', cursor: 'pointer' }}
                                />
                                {file && <p style={{ fontSize: 11.5, color: 'var(--accent)', marginTop: 5 }}>{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                Version <span style={{ color: 'var(--error)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                pattern="\d+\.\d+\.\d+"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                className="input"
                                style={{ fontFamily: 'var(--font-mono)' }}
                                placeholder="1.0.2"
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Format: major.minor.patch</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Platform</label>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
                                {currentApp.platforms?.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                Rollout: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{rolloutVal}%</span>
                            </label>
                            <div style={{ paddingTop: 4 }}>
                                <input
                                    type="range" min="0" max="100" value={rolloutVal}
                                    onChange={(e) => setRolloutVal(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                                    <span>0%</span><span>50%</span><span>100%</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none',
                                    cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontWeight: 500,
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                                Advanced Targeting
                            </button>
                        </div>

                        {showAdvanced && (
                            <>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Segment</label>
                                    <select value={segment} onChange={(e) => setSegment(e.target.value)} className="input">
                                        <option value="all">All users</option>
                                        <option value="beta_testers">Beta testers</option>
                                        <option value="canary">Canary</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                        Countries <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 11.5 }}>(e.g. IN,US,GB)</span>
                                    </label>
                                    <input type="text" value={countries} onChange={(e) => setCountries(e.target.value)} className="input" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} placeholder="IN,US,GB  (blank = all)" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                        Min Client Version <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 11.5 }}>(optional)</span>
                                    </label>
                                    <input type="text" value={minVersion} pattern="(\d+\.\d+\.\d+)?" onChange={(e) => setMinVersion(e.target.value)} className="input" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} placeholder="1.0.0" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>
                                        Max Client Version <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 11.5 }}>(optional)</span>
                                    </label>
                                    <input type="text" value={maxVersion} pattern="(\d+\.\d+\.\d+)?" onChange={(e) => setMaxVersion(e.target.value)} className="input" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} placeholder="1.9.9" />
                                </div>
                            </>
                        )}

                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" disabled={uploading} className="btn btn-primary">
                                {uploading ? (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                        Upload Bundle
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </SectionCard>

            {/* Versions table */}
            <SectionCard
                title="Versions"
                subtitle={`${versions.length} bundle${versions.length !== 1 ? 's' : ''} deployed`}
                action={
                    <button
                        onClick={handleRollback}
                        disabled={versions.length < 2}
                        className="btn btn-ghost btn-sm"
                        style={{ color: versions.length >= 2 ? 'var(--error)' : undefined, borderColor: versions.length >= 2 ? '#FECACA' : undefined }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.46" />
                        </svg>
                        Rollback
                    </button>
                }
            >
                {versions.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                        No versions uploaded yet. Upload your first bundle above.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Platform</th>
                                    <th>Rollout</th>
                                    <th>Segment</th>
                                    <th>Targeting</th>
                                    <th>Status</th>
                                    <th>Size</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {versions.map((v) => (
                                    <tr key={v._id}>
                                        <td>
                                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)' }}>
                                                v{v.version}
                                            </code>
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{v.platform}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 48, height: 4, borderRadius: 99, background: 'var(--bg-muted)', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${v.rollout}%`, height: '100%',
                                                        background: v.rollout === 100 ? 'var(--success)' : 'var(--accent)',
                                                        borderRadius: 99,
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 500 }}>{v.rollout}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            {v.segment && v.segment !== 'all' ? (
                                                <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{v.segment}</span>
                                            ) : (
                                                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>All users</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.7 }}>
                                                {v.minVersion && <div>min: <code style={{ fontFamily: 'var(--font-mono)' }}>{v.minVersion}</code></div>}
                                                {v.maxVersion && <div>max: <code style={{ fontFamily: 'var(--font-mono)' }}>{v.maxVersion}</code></div>}
                                                {v.countries?.length > 0 && <div>{v.countries.join(', ')}</div>}
                                                {!v.minVersion && !v.maxVersion && !v.countries?.length && (
                                                    <span style={{ color: 'var(--border-strong)' }}>—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${v.isActive ? 'badge-green' : 'badge-gray'}`}>
                                                {v.isActive ? (
                                                    <>
                                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                                                        Active
                                                    </>
                                                ) : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                                                {v.size ? `${(v.size / 1024).toFixed(0)} KB` : '—'}
                                            </span>
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {new Date(v.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {v.isActive && (
                                                <select
                                                    value={v.rollout}
                                                    onChange={(e) => handleRolloutChange(v._id, Number(e.target.value))}
                                                    className="input"
                                                    style={{ padding: '4px 8px', fontSize: 12, width: 'auto', fontFamily: 'var(--font-sans)' }}
                                                >
                                                    {[5, 10, 20, 50, 100].map((r) => (
                                                        <option key={r} value={r}>{r}%</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
