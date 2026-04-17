import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/appStore';

export default function DashboardPage() {
    const { apps, fetchApps, loading } = useAppStore();

    useEffect(() => {
        fetchApps();
    }, []);

    const totalApps = apps.length;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm text-gray-500 mb-1">Total Apps</p>
                    <p className="text-3xl font-bold text-indigo-600">{totalApps}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm text-gray-500 mb-1">Platforms</p>
                    <p className="text-3xl font-bold text-green-600">Android & iOS</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm text-gray-500 mb-1">System Status</p>
                    <p className="text-3xl font-bold text-emerald-600">✓ Online</p>
                </div>
            </div>

            {/* Recent apps */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your Apps</h2>
                    <Link
                        to="/apps"
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-400">Loading...</div>
                ) : apps.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        No apps yet.{' '}
                        <Link to="/apps" className="text-indigo-600 hover:underline">
                            Create one
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y">
                        {apps.slice(0, 5).map((app) => (
                            <Link
                                key={app._id}
                                to={`/apps/${app._id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium">{app.name}</p>
                                    <p className="text-sm text-gray-500">ID: {app.appId}</p>
                                </div>
                                <div className="flex gap-1">
                                    {app.platforms?.map((p) => (
                                        <span
                                            key={p}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                        >
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
