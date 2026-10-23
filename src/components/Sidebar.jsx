import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiFolder,
  FiBookOpen,
  FiFileText,
  FiLayout,
  FiUsers,
  FiSettings,
  FiX,
  FiLogOut
} from 'react-icons/fi';
import { GiChefToque } from 'react-icons/gi';
import { IoFastFoodOutline } from 'react-icons/io5';

const navItems = [
  { path: '/', icon: FiGrid, label: 'Dashboard' },
  { path: '/categories', icon: FiFolder, label: 'Categories' },
  { path: '/menu', icon: IoFastFoodOutline, label: 'Menu' },
  { path: '/orders', icon: FiFileText, label: 'Orders', badge: '3' },
  { path: '/tables', icon: FiLayout, label: 'Tables' },
  { path: '/staff', icon: FiUsers, label: 'Staff' },
  { path: '/settings', icon: FiSettings, label: 'Settings' }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          width: '240px',
          height: '100vh',
          backgroundColor: '#0a0d18',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          boxSizing: 'border-box',
          flexShrink: 0,
          zIndex: 50,
          position: isOpen ? 'fixed' : 'relative',
          left: 0,
          top: 0
        }}
      >
        <div>
          {/* Brand Logo Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              marginBottom: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GiChefToque style={{ fontSize: '22px', color: '#818cf8' }} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: '1.2',
                    letterSpacing: '-0.01em',
                    margin: 0
                  }}
                >
                  Flavour Haven
                </h1>
                <p
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#6366f1',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: 0,
                    marginTop: '2px'
                  }}
                >
                  Restaurant Admin
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'none'
              }}
              className="lg:hidden"
            >
              <FiX style={{ fontSize: '18px' }} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : '#8b9bb4',
                    backgroundColor: isActive ? '#4338ca' : 'transparent',
                    transition: 'all 0.15s ease'
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#8b9bb4';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon style={{ fontSize: '17px' }} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        padding: '1px 6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        backgroundColor: '#7c3aed',
                        color: '#ffffff'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Logout */}
        <div>
          {/* Promotional Promo Card matching reference */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#0e1326',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '12px'
            }}
          >
            {/* Wave background aesthetic */}
            <div
              style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-15px',
                width: '100px',
                height: '70px',
                background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.35), transparent 70%)',
                filter: 'blur(10px)',
                pointerEvents: 'none'
              }}
            />

            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <IoFastFoodOutline style={{ fontSize: '18px', color: '#c084fc' }} />
            </div>

            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 2px 0'
              }}
            >
              Good Food
            </h4>
            <h5
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}
            >
              Happy People
            </h5>
            <p
              style={{
                fontSize: '10px',
                color: '#64748b',
                margin: 0,
                lineHeight: '1.4'
              }}
            >
              Manage your restaurant effortlessly
            </p>
          </div>

          {/* Quick Logout */}
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f43f5e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <FiLogOut style={{ fontSize: '15px' }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
