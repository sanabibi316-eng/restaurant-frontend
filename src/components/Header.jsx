import { FiSearch, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuToggle }) => {
  const { admin } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#070913',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        flexShrink: 0
      }}
    >
      {/* Left: Search input capsule matching screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '420px' }}>
        <button
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            display: 'none'
          }}
          className="lg:hidden"
        >
          ☰
        </button>

        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FiSearch
            style={{
              position: 'absolute',
              left: '16px',
              color: '#475569',
              fontSize: '15px',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            style={{
              width: '100%',
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '9999px',
              padding: '9px 16px 9px 42px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
            }}
          />
        </div>
      </div>

      {/* Right: Notification Bell & Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell with Red Badge Dot */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: '#8b9bb4',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8b9bb4')}
        >
          <FiBell style={{ fontSize: '18px' }} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }}
          />
        </button>

        {/* Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)'
            }}
          >
            {getInitials(admin?.name)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: '1.2'
              }}
            >
              {admin?.name || 'Admin'}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: '#64748b',
                lineHeight: '1.2',
                marginTop: '2px'
              }}
            >
              Restaurant Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
