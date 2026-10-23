import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { GiChefToque } from 'react-icons/gi';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: 'admin@restaurant.com',
    password: 'admin123'
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText('Email: admin@restaurant.com | Password: admin123');
    setCopied(true);
    toast.success('Admin credentials copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const autoFillDemo = () => {
    setForm({ email: 'admin@restaurant.com', password: 'admin123' });
    toast.success('Pre-filled default credentials');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05070d',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.16), transparent 45%), radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1), transparent 45%)',
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        userSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Centered Glass Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(13, 19, 33, 0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '24px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 60px -10px rgba(124, 58, 237, 0.18)',
          padding: '38px 34px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f59e0b, #ea580c 60%, #7c3aed)',
              padding: '2px',
              boxShadow: '0 10px 28px -4px rgba(245, 158, 11, 0.38)'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#090d16',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GiChefToque style={{ fontSize: '32px', color: '#fbbf24', display: 'block' }} />
            </div>
          </div>

          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}
          >
            Flavour Haven
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#94a3b8',
              letterSpacing: '0.01em'
            }}
          >
            Restaurant Administration Portal
          </p>
        </div>

        {/* Demo Credentials Callout */}
        <div
          style={{
            marginBottom: '26px',
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: 'rgba(23, 31, 51, 0.75)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <FiShield style={{ fontSize: '13px', display: 'inline-block', flexShrink: 0 }} />
              <span>Default Demo Access</span>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#cbd5e1',
                marginTop: '4px',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              admin@restaurant.com • admin123
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={copyCredentials}
              title="Copy credentials"
              style={{
                padding: '6px 11px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#e2e8f0',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {copied ? (
                <FiCheck style={{ color: '#10b981', fontSize: '12px', display: 'inline-block' }} />
              ) : (
                <FiCopy style={{ fontSize: '12px', display: 'inline-block' }} />
              )}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={autoFillDemo}
              title="Auto-fill form"
              style={{
                padding: '6px 11px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Fill
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '8px',
                letterSpacing: '0.02em'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '0',
                  bottom: '0',
                  width: '20px',
                  color: '#94a3b8',
                  fontSize: '16px',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiMail style={{ display: 'block' }} />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@restaurant.com"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 16px 13px 44px',
                  backgroundColor: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.18)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '8px',
                letterSpacing: '0.02em'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '0',
                  bottom: '0',
                  width: '20px',
                  color: '#94a3b8',
                  fontSize: '16px',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiLock style={{ display: 'block' }} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 44px 13px 44px',
                  backgroundColor: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.18)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '0',
                  bottom: '0',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
                title={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <FiEyeOff style={{ display: 'block' }} />
                ) : (
                  <FiEye style={{ display: 'block' }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              color: '#0a0a0a',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
              marginTop: '4px',
              transition: 'transform 0.15s ease, filter 0.15s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.filter = 'brightness(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(0.99)';
            }}
            onMouseUp={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? (
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTopColor: '#000000',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <FiArrowRight style={{ fontSize: '16px', display: 'block' }} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div
          style={{
            marginTop: '26px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>🔒</span>
          <span>Encrypted Session • Authorized Admin Access Only</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
