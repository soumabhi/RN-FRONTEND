import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/apps', label: 'Apps', icon: '📱' },
    { to: '/logs', label: 'Logs', icon: '📋' },
];

export default function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold tracking-tight">🚀 RN-OTA</h1>
                    <p className="text-xs text-gray-400 mt-1">OTA Update Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <div className="max-w-6xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
