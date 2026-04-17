import { useEffect, useState } from 'react';
import useAppStore from '../store/appStore';

const EVENT_COLORS = {
    app_start: 'bg-blue-50 text-blue-700',
    update_success: 'bg-green-50 text-green-700',
    update_failed: 'bg-red-50 text-red-700',
    crash: 'bg-orange-50 text-orange-700',
};

export default function LogsPage() {
    const { apps, fetchApps, logs, logSummary, fetchLogs, loading } = useAppStore();
    const [filterApp, setFilterApp] = useState('');
    const [filterEvent, setFilterEvent] = useState('');

    useEffect(() => {
        fetchApps();
    }, []);

    useEffect(() => {
        const params = {};
        if (filterApp) params.appId = filterApp;
        if (filterEvent) params.event = filterEvent;
        params.limit = 200;
        fetchLogs(params);
    }, [filterApp, filterEvent]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Logs & Analytics</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    value={filterApp}
                    onChange={(e) => setFilterApp(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Apps</option>
                    {apps.map((a) => (
                        <option key={a._id} value={a.appId}>{a.name} ({a.appId})</option>
                    ))}
                </select>

                <select
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Events</option>
                    <option value="app_start">App Start</option>
                    <option value="update_success">Update Success</option>
                    <option value="update_failed">Update Failed</option>
                    <option value="crash">Crash</option>
                </select>
            </div>

            {/* Summary cards */}
            {Object.keys(logSummary).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(logSummary).map(([ver, data]) => (
                        <div key={ver} className="bg-white rounded-xl shadow-sm border p-4">
                            <p className="text-sm text-gray-500 mb-1">v{ver}</p>
                            <p className="text-xl font-bold">{data.total} events</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {Object.entries(data.events).map(([evt, count]) => (
                                    <span
                                        key={evt}
                                        className={`text-xs px-2 py-0.5 rounded-full ${EVENT_COLORS[evt] || 'bg-gray-100 text-gray-600'}`}
                                    >
                                        {evt}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Logs table */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 border-b">
                    <h2 className="text-sm font-medium text-gray-500">
                        Showing {logs.length} log entries
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-400">Loading...</div>
                ) : logs.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">No log entries found.</div>
                ) : (
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="p-3 font-medium">Time</th>
                                    <th className="p-3 font-medium">App</th>
                                    <th className="p-3 font-medium">Event</th>
                                    <th className="p-3 font-medium">Version</th>
                                    <th className="p-3 font-medium">Platform</th>
                                    <th className="p-3 font-medium">User</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-500 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-3 font-mono text-xs">{log.appId}</td>
                                        <td className="p-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EVENT_COLORS[log.event] || ''}`}>
                                                {log.event}
                                            </span>
                                        </td>
                                        <td className="p-3 font-mono text-xs">{log.version}</td>
                                        <td className="p-3 capitalize">{log.platform}</td>
                                        <td className="p-3 text-gray-500 font-mono text-xs truncate max-w-[120px]">
                                            {log.userId}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
