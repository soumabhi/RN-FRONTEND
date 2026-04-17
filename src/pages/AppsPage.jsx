import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/appStore';

export default function AppsPage() {
    const { apps, fetchApps, createApp, deleteApp, loading, error, clearError } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [appId, setAppId] = useState('');
    const [platforms, setPlatforms] = useState(['android']);

    useEffect(() => {
        fetchApps();
    }, []);

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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Apps</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    + New App
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 cursor-pointer" onClick={clearError}>
                    {error}
                </div>
            )}

            {/* Apps list */}
            <div className="bg-white rounded-xl shadow-sm border">
                {loading ? (
                    <div className="p-6 text-center text-gray-400">Loading...</div>
                ) : apps.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-lg mb-2">No apps yet</p>
                        <p className="text-sm">Create your first app to get started.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-sm text-gray-500">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">App ID</th>
                                <th className="p-4 font-medium">API Key</th>
                                <th className="p-4 font-medium">Platforms</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {apps.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <Link to={`/apps/${app._id}`} className="font-medium text-indigo-600 hover:underline">
                                            {app.name}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">{app.appId}</td>
                                    <td className="p-4">
                                        <code className="text-xs bg-gray-100 p-1 rounded break-all">
                                            {app.apiKey?.slice(0, 16)}...
                                        </code>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {app.platforms?.map((p) => (
                                                <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(app._id, app.name)}
                                            className="text-red-500 text-sm hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Create New App</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="My App"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                                <input
                                    type="text"
                                    required
                                    pattern="[a-z0-9-]+"
                                    value={appId}
                                    onChange={(e) => setAppId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                    placeholder="my-app"
                                />
                                <p className="text-xs text-gray-400 mt-1">Lowercase, numbers, hyphens only</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                                <div className="flex gap-3">
                                    {['android', 'ios'].map((p) => (
                                        <label key={p} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={platforms.includes(p)}
                                                onChange={() => togglePlatform(p)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm capitalize">{p}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
