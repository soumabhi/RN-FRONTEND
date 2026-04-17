import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

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
    const [showApiKey, setShowApiKey] = useState(false);
    const [uploading, setUploading] = useState(false);

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

        const result = await uploadVersion(form);
        setUploading(false);

        if (result) {
            setFile(null);
            setVersion('');
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

    if (!currentApp && loading) {
        return <div className="text-center text-gray-400 py-12">Loading...</div>;
    }

    if (!currentApp) {
        return <div className="text-center text-gray-400 py-12">App not found</div>;
    }

    return (
        <div>
            <button onClick={() => navigate('/apps')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
                ← Back to Apps
            </button>

            {/* App info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">{currentApp.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">App ID:</span>{' '}
                        <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{currentApp.appId}</code>
                    </div>
                    <div>
                        <span className="text-gray-500">Platforms:</span>{' '}
                        {currentApp.platforms?.map((p) => (
                            <span key={p} className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs ml-1 capitalize">
                                {p}
                            </span>
                        ))}
                    </div>
                    <div>
                        <span className="text-gray-500">API Key:</span>{' '}
                        <button onClick={() => setShowApiKey(!showApiKey)} className="text-indigo-600 text-xs hover:underline ml-1">
                            {showApiKey ? 'Hide' : 'Show'}
                        </button>
                        {showApiKey && (
                            <code className="block mt-1 bg-gray-100 p-2 rounded text-xs break-all font-mono">
                                {currentApp.apiKey}
                            </code>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 cursor-pointer" onClick={clearError}>
                    {error}
                </div>
            )}

            {/* Upload form */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Upload New Bundle</h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bundle File</label>
                        <input
                            type="file"
                            accept=".js,.bundle"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                        <input
                            type="text"
                            required
                            pattern="\d+\.\d+\.\d+"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="1.0.2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {currentApp.platforms?.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rollout: {rolloutVal}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={rolloutVal}
                            onChange={(e) => setRolloutVal(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {uploading ? 'Uploading...' : 'Upload Bundle'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Versions table */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Versions</h2>
                    <button
                        onClick={handleRollback}
                        disabled={versions.length < 2}
                        className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-30 transition-colors"
                    >
                        Rollback
                    </button>
                </div>

                {versions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">No versions uploaded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                                    <th className="p-4 font-medium">Version</th>
                                    <th className="p-4 font-medium">Platform</th>
                                    <th className="p-4 font-medium">Rollout</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Size</th>
                                    <th className="p-4 font-medium">Created</th>
                                    <th className="p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {versions.map((v) => (
                                    <tr key={v._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono font-medium">v{v.version}</td>
                                        <td className="p-4 text-sm capitalize">{v.platform}</td>
                                        <td className="p-4 text-sm">{v.rollout}%</td>
                                        <td className="p-4">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${v.isActive
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {v.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {v.size ? `${(v.size / 1024).toFixed(0)} KB` : '—'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(v.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {v.isActive && (
                                                <select
                                                    value={v.rollout}
                                                    onChange={(e) => handleRolloutChange(v._id, Number(e.target.value))}
                                                    className="text-xs border rounded px-2 py-1"
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
            </div>
        </div>
    );
}
