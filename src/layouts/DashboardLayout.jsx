import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const links = [
    {
        to: '/', label: 'Dashboard',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        to: '/apps', label: 'Apps',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
    },
    {
        to: '/logs', label: 'Logs',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
];

export default function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-subtle)' }}>
            {/* Sidebar */}
            <aside style={{
                width: 220,
                minWidth: 220,
                background: 'var(--bg)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-xs)',
                zIndex: 10,
            }}>
                {/* Logo */}
                <div style={{
                    padding: '20px 20px 18px',
                    borderBottom: '1px solid var(--border)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 32, height: 32,
                            background: 'var(--accent)',
                            borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>RN-OTA</div>
                            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Update Platform</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 10px' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '6px 10px 8px' }}>
                        Menu
                    </div>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                borderRadius: 'var(--radius)',
                                fontSize: 13.5,
                                fontWeight: isActive ? 600 : 450,
                                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                                background: isActive ? 'var(--accent-light)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all .15s ease',
                                marginBottom: 2,
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.classList.contains('active')) {
                                    e.currentTarget.style.background = 'var(--bg-muted)';
                                    e.currentTarget.style.color = 'var(--text-1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.getAttribute('aria-current')) {
                                    e.currentTarget.style.background = '';
                                    e.currentTarget.style.color = '';
                                }
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div style={{ padding: '12px 14px 16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 8px', borderRadius: 'var(--radius)',
                        background: 'var(--bg-subtle)',
                        marginBottom: 6,
                    }}>
                        <div style={{
                            width: 30, height: 30,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                        }}>
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            fontSize: 12.5, fontWeight: 500, color: 'var(--text-3)',
                            transition: 'all .15s ease', textAlign: 'left',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'var(--error-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 36px' }} className="animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

