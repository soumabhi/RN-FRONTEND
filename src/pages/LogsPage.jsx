import { useEffect, useState } from 'react';
import useAppStore from '../store/appStore';

const EVENT_BADGE = {
    app_start: 'badge-blue',
    update_success: 'badge-green',
    update_failed: 'badge-red',
    crash: 'badge-orange',
};

const EVENT_LABEL = {
    app_start: 'App Start',
    update_success: 'Update Success',
    update_failed: 'Update Failed',
    crash: 'Crash',
};

export default function LogsPage() {
    const { apps, fetchApps, logs, logSummary, fetchLogs, loading } = useAppStore();
    const [filterApp, setFilterApp] = useState('');
    const [filterEvent, setFilterEvent] = useState('');

    useEffect(() => { fetchApps(); }, []);

    useEffect(() => {
        const params = {};
        if (filterApp) params.appId = filterApp;
        if (filterEvent) params.event = filterEvent;
        params.limit = 200;
        fetchLogs(params);
    }, [filterApp, filterEvent]);

    const summaryEntries = Object.entries(logSummary);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                    Logs &amp; Analytics
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                    Monitor app events, update delivery, and crash reports
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <select
                        value={filterApp}
                        onChange={(e) => setFilterApp(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 30, width: 220 }}
                    >
                        <option value="">All Apps</option>
                        {apps.map((a) => (
                            <option key={a._id} value={a.appId}>{a.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ position: 'relative' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <select
                        value={filterEvent}
                        onChange={(e) => setFilterEvent(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 30, width: 190 }}
                    >
                        <option value="">All Events</option>
                        <option value="app_start">App Start</option>
                        <option value="update_success">Update Success</option>
                        <option value="update_failed">Update Failed</option>
                        <option value="crash">Crash</option>
                    </select>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-3)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {logs.length} entries
                </div>
            </div>

            {/* Summary cards */}
            {summaryEntries.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
                    {summaryEntries.map(([ver, data]) => (
                        <div key={ver} className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>
                                    v{ver}
                                </code>
                                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>{data.total}</span>
                            </div>
                            <p style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 8 }}>total events</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {Object.entries(data.events).map(([evt, count]) => (
                                    <span key={evt} className={`badge ${EVENT_BADGE[evt] || 'badge-gray'}`}>
                                        {EVENT_LABEL[evt] || evt}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Logs table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Event Log</h2>
                    {loading && (
                        <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Loading
                        </span>
                    )}
                </div>

                {!loading && logs.length === 0 ? (
                    <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border-strong)', margin: '0 auto 12px' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                        </svg>
                        <p style={{ fontSize: 13.5, color: 'var(--text-3)', fontWeight: 500 }}>No log entries found</p>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, opacity: .7 }}>Try adjusting your filters or wait for events to come in</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
                        <table className="data-table">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr>
                                    <th>Time</th>
                                    <th>App</th>
                                    <th>Event</th>
                                    <th>Version</th>
                                    <th>Platform</th>
                                    <th>User ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log._id}>
                                        <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-3)' }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td>
                                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-2)' }}>
                                                {log.appId}
                                            </code>
                                        </td>
                                        <td>
                                            <span className={`badge ${EVENT_BADGE[log.event] || 'badge-gray'}`}>
                                                {EVENT_LABEL[log.event] || log.event}
                                            </span>
                                        </td>
                                        <td>
                                            {log.version ? (
                                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>
                                                    v{log.version}
                                                </code>
                                            ) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>
                                            {log.platform || <span style={{ color: 'var(--text-3)' }}>—</span>}
                                        </td>
                                        <td>
                                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', display: 'block', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {log.userId || '—'}
                                            </code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
