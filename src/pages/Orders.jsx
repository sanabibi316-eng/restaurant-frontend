import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiX,
  FiSearch,
  FiEye,
  FiTrash2,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'];

const getBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
    case 'confirmed':
      return { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' };
    case 'preparing':
      return { backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' };
    case 'ready':
      return { backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' };
    case 'served':
      return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
    case 'completed':
      return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' };
    case 'cancelled':
      return { backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' };
    default:
      return { backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.25)' };
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const [newOrder, setNewOrder] = useState({
    table: '',
    customerName: 'Walk-in',
    customerPhone: '',
    paymentMethod: 'cash',
    notes: '',
    items: []
  });

  const fetchOrders = async () => {
    try {
      const params = { limit: 50 };
      if (filter) params.status = filter;
      if (search) params.search = search;

      const { data } = await API.get('/orders', { params });
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchMeta = async () => {
    try {
      const [tablesRes, menuRes] = await Promise.all([
        API.get('/tables').catch(() => ({ data: { tables: [] } })),
        API.get('/menu?available=true&limit=100').catch(() => ({ data: { items: [] } }))
      ]);
      setTables(tablesRes.data.tables || []);
      setMenuItems(menuRes.data.items || []);
    } catch {
      // silent
    }
  };

  const openCreate = async () => {
    await fetchMeta();
    setNewOrder({
      table: '',
      customerName: 'Walk-in',
      customerPhone: '',
      paymentMethod: 'cash',
      notes: '',
      items: []
    });
    setCreateModal(true);
  };

  const addItemToOrder = (item) => {
    const existing = newOrder.items.find((i) => i.menuItem === item._id);
    if (existing) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map((i) =>
          i.menuItem === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [
          ...newOrder.items,
          { menuItem: item._id, name: item.name, price: item.price, quantity: 1 }
        ]
      });
    }
  };

  const removeItemFromOrder = (idx) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== idx)
    });
  };

  const orderTotal = newOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (newOrder.items.length === 0) return toast.error('Please add at least one menu item');
    setSaving(true);

    try {
      await API.post('/orders', newOrder);
      toast.success('Order placed successfully');
      setCreateModal(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      if (detailOrder?._id === orderId) {
        setDetailOrder({ ...detailOrder, status });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const markPaid = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/status`, { paymentStatus: 'paid' });
      toast.success('Payment recorded as paid');
      fetchOrders();
      if (detailOrder?._id === orderId) {
        setDetailOrder({ ...detailOrder, paymentStatus: 'paid' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await API.delete(`/orders/${id}`);
      toast.success('Order deleted');
      fetchOrders();
      if (detailOrder?._id === id) setDetailOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const viewDetail = async (id) => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setDetailOrder(data.order);
    } catch (err) {
      toast.error('Failed to load order details');
    }
  };

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
            Order Management
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Monitor, prepare, and dispatch dining & takeaway orders
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
          <span>New Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {['', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filter === tab ? '#4338ca' : 'transparent',
                  color: filter === tab ? '#ffffff' : '#8b9bb4',
                  textTransform: 'capitalize'
                }}
              >
                {tab || 'All Orders'}
              </button>
            )
          )}
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
            placeholder="Search order or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
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

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: '#0c1020',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '18px',
          padding: '20px',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
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
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <FiFileText style={{ fontSize: '36px', opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '13px' }}>No orders found for this view</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '12px'
              }}
            >
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Order #</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Table</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Total Amount</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Payment</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 12px', color: '#818cf8', fontWeight: 700 }}>
                      {o.orderNumber || `#${o._id.slice(-4)}`}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#ffffff', fontWeight: 600 }}>
                      {o.customerName || 'Walk-in'}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#94a3b8' }}>
                      {o.table?.number ? `Table #${o.table.number}` : 'No Table'}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#ffffff', fontWeight: 700 }}>
                      ${(o.total || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          ...getBadgeStyle(o.status)
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          backgroundColor: o.paymentStatus === 'paid' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: o.paymentStatus === 'paid' ? '#34d399' : '#fbbf24',
                          border: o.paymentStatus === 'paid' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)'
                        }}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#64748b' }}>
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => viewDetail(o._id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: '#11162b',
                            color: '#e2e8f0',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FiEye /> View
                        </button>
                        <button
                          onClick={() => handleDelete(o._id)}
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
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
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
          onClick={() => setDetailOrder(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Order {detailOrder.orderNumber}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Customer: {detailOrder.customerName}
                </span>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}
              >
                <FiX />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#11162b',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontSize: '12px', color: '#8b9bb4' }}>Move Status:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {statusFlow.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(detailOrder._id, s)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: detailOrder.status === s ? '#4338ca' : 'rgba(255,255,255,0.05)',
                      color: detailOrder.status === s ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Item list */}
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>Order Items:</span>
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {detailOrder.items?.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#11162b',
                      fontSize: '12px'
                    }}
                  >
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>
                      {it.name || it.menuItem?.name} <span style={{ color: '#818cf8' }}>× {it.quantity}</span>
                    </span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>
                      ${((it.price || 0) * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Payment action */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Final Total</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                  ${(detailOrder.total || 0).toFixed(2)}
                </div>
              </div>

              {detailOrder.paymentStatus !== 'paid' && (
                <button
                  onClick={() => markPaid(detailOrder._id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#022c22',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {createModal && (
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
          onClick={() => setCreateModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '650px',
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Place Direct Order
              </h2>
              <button
                onClick={() => setCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Customer Name
                  </label>
                  <input
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
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
                    Select Table
                  </label>
                  <select
                    value={newOrder.table}
                    onChange={(e) => setNewOrder({ ...newOrder, table: e.target.value })}
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
                    <option value="">No Table (Takeaway)</option>
                    {tables.map((t) => (
                      <option key={t._id} value={t._id}>
                        Table #{t.number} ({t.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pick items */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Click to add Dishes:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                  {menuItems.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => addItemToOrder(m)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        backgroundColor: '#11162b',
                        color: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      + {m.name} (${m.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Added items list */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Items in Basket ({newOrder.items.length})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {newOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#11162b',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    >
                      <span>
                        {it.name} <strong style={{ color: '#818cf8' }}>×{it.quantity}</strong> (${it.price * it.quantity})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItemFromOrder(idx)}
                        style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Total: ${orderTotal.toFixed(2)}
                </span>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#4338ca',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Placing Order...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
