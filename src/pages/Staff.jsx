import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiPhone,
  FiMail,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi';

const roleStyles = {
  manager: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.25)' },
  chef: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.25)' },
  waiter: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.25)' },
  cashier: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' },
  cleaner: { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.25)' },
  other: { bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.2)' }
};

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
    salary: '',
    shift: 'flexible',
    address: ''
  });

  const fetchStaff = async () => {
    try {
      const params = {};
      if (filterRole) params.role = filterRole;
      const { data } = await API.get('/staff', { params });
      setStaff(data.staff || []);
    } catch {
      toast.error('Failed to load restaurant team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [filterRole]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
      salary: '',
      shift: 'flexible',
      address: ''
    });
    setModal(true);
  };

  const openEdit = (member) => {
    setEditId(member._id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      role: member.role || 'waiter',
      salary: member.salary || '',
      shift: member.shift || 'flexible',
      address: member.address || ''
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);

    try {
      if (editId) {
        await API.put(`/staff/${editId}`, form);
        toast.success('Staff member updated');
      } else {
        await API.post('/staff', form);
        toast.success('Staff member onboarded');
      }
      setModal(false);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await API.delete(`/staff/${id}`);
      toast.success('Staff member removed');
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async (member) => {
    try {
      await API.put(`/staff/${member._id}`, { isActive: !member.isActive });
      toast.success(`Staff member set to ${!member.isActive ? 'Active' : 'On Leave'}`);
      fetchStaff();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 4px 0'
            }}
          >
            Staff & Team Members
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Manage kitchen crew, dining waiters, shift hours and roles
          </p>
        </div>

        <button
          onClick={openCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#4338ca',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
        >
          <FiPlus style={{ fontSize: '16px' }} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role Filter & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#0c1020',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '14px',
          padding: '8px 12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {['', 'manager', 'chef', 'waiter', 'cashier', 'cleaner'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterRole === r ? '#4338ca' : 'transparent',
                color: filterRole === r ? '#ffffff' : '#8b9bb4',
                textTransform: 'capitalize'
              }}
            >
              {r || 'All Roles'}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '14px'
            }}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: '#11162b',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '7px 12px 7px 34px',
              color: '#ffffff',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Staff Cards Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite'
            }}
          />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div
          style={{
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '18px',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748b'
          }}
        >
          <FiUsers style={{ fontSize: '36px', opacity: 0.3, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '13px' }}>No staff members found</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredStaff.map((m) => {
            const roleStyle = roleStyles[m.role] || roleStyles.other;
            return (
              <div
                key={m._id}
                style={{
                  backgroundColor: '#0c1020',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '18px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '14px',
                          backgroundColor: '#11162b',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#ffffff'
                        }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          {m.name}
                        </h3>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            ...roleStyle
                          }}
                        >
                          {m.role}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => openEdit(m)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          backgroundColor: '#11162b',
                          color: '#94a3b8',
                          cursor: 'pointer'
                        }}
                        title="Edit"
                      >
                        <FiEdit2 style={{ fontSize: '12px' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(244, 63, 94, 0.2)',
                          backgroundColor: 'rgba(244, 63, 94, 0.08)',
                          color: '#fb7185',
                          cursor: 'pointer'
                        }}
                        title="Delete"
                      >
                        <FiTrash2 style={{ fontSize: '12px' }} />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7e8ca0' }}>
                      <FiMail style={{ color: '#64748b' }} />
                      <span>{m.email}</span>
                    </div>
                    {m.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7e8ca0' }}>
                        <FiPhone style={{ color: '#64748b' }} />
                        <span>{m.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer shift & toggle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, textTransform: 'capitalize' }}>
                    {m.shift} Shift
                  </span>

                  <button
                    onClick={() => toggleStatus(m)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: m.isActive !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                      color: m.isActive !== false ? '#34d399' : '#94a3b8'
                    }}
                  >
                    {m.isActive !== false ? 'Active Status' : 'On Leave'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '20px'
          }}
          onClick={() => setModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {editId ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button
                onClick={() => setModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#11162b',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@restaurant.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#11162b',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#11162b',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Role Assignment
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#11162b',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="waiter">Waiter / Floor Staff</option>
                    <option value="chef">Kitchen Chef / Cook</option>
                    <option value="manager">Shift Manager</option>
                    <option value="cashier">Cashier</option>
                    <option value="cleaner">Support & Cleaning</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Shift
                  </label>
                  <select
                    value={form.shift}
                    onChange={(e) => setForm({ ...form, shift: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#11162b',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="morning">Morning Shift</option>
                    <option value="evening">Evening Shift</option>
                    <option value="night">Night Shift</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Onboard Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
