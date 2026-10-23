import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLayout,
  FiUsers,
  FiMapPin
} from 'react-icons/fi';

const statusConfig = {
  available: {
    label: 'Available',
    color: '#34d399',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.25)'
  },
  occupied: {
    label: 'Occupied',
    color: '#fb7185',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.25)'
  },
  reserved: {
    label: 'Reserved',
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.25)'
  },
  maintenance: {
    label: 'Maintenance',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: '1px solid rgba(148, 163, 184, 0.25)'
  }
};

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    number: '',
    capacity: 4,
    location: 'indoor',
    status: 'available'
  });

  const fetchTables = async () => {
    try {
      const { data } = await API.get('/tables');
      setTables(data.tables || []);
    } catch {
      toast.error('Failed to load dining tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ number: '', capacity: 4, location: 'indoor', status: 'available' });
    setModal(true);
  };

  const openEdit = (t) => {
    setEditId(t._id);
    setForm({
      number: t.number,
      capacity: t.capacity,
      location: t.location || 'indoor',
      status: t.status || 'available'
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.number) return toast.error('Table number is required');
    setSaving(true);

    try {
      if (editId) {
        await API.put(`/tables/${editId}`, form);
        toast.success('Table updated successfully');
      } else {
        await API.post('/tables', form);
        toast.success('Table added successfully');
      }
      setModal(false);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await API.delete(`/tables/${id}`);
      toast.success('Table deleted');
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      await API.put(`/tables/${tableId}`, { status: newStatus });
      toast.success(`Table marked as ${newStatus}`);
      fetchTables();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredTables = tables.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Header */}
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
            Dining Floor & Tables
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Live status of indoor, outdoor & VIP seating arrangements
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
          <span>Add Table</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#0c1020',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '14px',
          padding: '8px 12px',
          overflowX: 'auto'
        }}
      >
        {['all', 'available', 'occupied', 'reserved', 'maintenance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: filter === tab ? '#4338ca' : 'transparent',
              color: filter === tab ? '#ffffff' : '#8b9bb4',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
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
      ) : filteredTables.length === 0 ? (
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
          <FiLayout style={{ fontSize: '36px', opacity: 0.3, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '13px' }}>No tables found matching this filter</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredTables.map((t) => {
            const st = statusConfig[t.status] || statusConfig.available;
            return (
              <div
                key={t._id}
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        backgroundColor: '#11162b',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#ffffff'
                      }}
                    >
                      #{t.number}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                        Table {t.number}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                          {t.location} Area
                        </span>
                        <span style={{ color: '#334155', fontSize: '10px' }}>•</span>
                        <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600 }}>
                          {t.capacity} Seats
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => openEdit(t)}
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
                      onClick={() => handleDelete(t._id)}
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

                {/* Status indicator pill & quick selector */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      backgroundColor: st.bg,
                      color: st.color,
                      border: st.border
                    }}
                  >
                    {st.label}
                  </span>

                  <select
                    value={t.status}
                    onChange={(e) => updateTableStatus(t._id, e.target.value)}
                    style={{
                      backgroundColor: '#11162b',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      fontSize: '11px',
                      padding: '4px 8px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
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
              maxWidth: '440px',
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
                {editId ? 'Edit Dining Table' : 'Add Dining Table'}
              </h2>
              <button
                onClick={() => setModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Table Number / Identifier *
                </label>
                <input
                  required
                  placeholder="e.g. 1, 2, 10, or T-VIP"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
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
                  Seat Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
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
                  Location Zone
                </label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#11162b',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="indoor">Indoor Dining Room</option>
                  <option value="outdoor">Outdoor Patio / Garden</option>
                  <option value="vip">VIP Lounge</option>
                  <option value="bar">Bar Counter</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Initial Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#11162b',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
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
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Table'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
