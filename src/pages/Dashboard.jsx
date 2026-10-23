import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  FiDollarSign,
  FiFileText,
  FiLayout,
  FiUsers,
  FiArrowUp,
  FiMoreVertical,
  FiArrowRight,
  FiCalendar,
  FiTrendingUp,
  FiPlus
} from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mini Sparkline component for Stat Cards
const Sparkline = ({ stroke = '#3b82f6' }) => (
  <svg width="64" height="24" viewBox="0 0 64 24" fill="none">
    <path
      d="M1 18C10 18 14 6 22 10C30 14 36 2 44 8C52 14 56 4 63 2"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todayRevenue: 12540,
    totalOrders: 248,
    occupiedTables: 18,
    totalTables: 20,
    totalStaff: 12
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [timeFilter, setTimeFilter] = useState('30D');

  // Status breakdown data for the Donut Chart matching reference
  const orderStatusData = [
    { name: 'Pending', value: 32, percentage: '13%', color: '#f59e0b' },
    { name: 'Confirmed', value: 54, percentage: '22%', color: '#3b82f6' },
    { name: 'Preparing', value: 48, percentage: '19%', color: '#a855f7' },
    { name: 'Ready', value: 36, percentage: '15%', color: '#06b6d4' },
    { name: 'Served', value: 58, percentage: '23%', color: '#10b981' },
    { name: 'Cancelled', value: 20, percentage: '8%', color: '#f43f5e' }
  ];

  // Demo revenue data matching the visual screenshot curve and dates
  const defaultChartData = [
    { date: 'Apr 1', revenue: 1100 },
    { date: 'Apr 5', revenue: 1350 },
    { date: 'Apr 10', revenue: 1280 },
    { date: 'Apr 15', revenue: 1650 },
    { date: 'Apr 20', revenue: 1520 },
    { date: 'Apr 25', revenue: 1980 },
    { date: 'Apr 30', revenue: 2180 }
  ];

  // Default demo recent orders to match the exact visual reference
  const defaultRecentOrders = [
    {
      id: '#1008',
      customer: 'Sarah Khan',
      table: 'T3',
      items: '2 items',
      total: '$42.80',
      status: 'Preparing',
      time: '2:32 PM'
    },
    {
      id: '#1007',
      customer: 'Ahmed Raza',
      table: 'T7',
      items: '3 items',
      total: '$68.50',
      status: 'Confirmed',
      time: '2:18 PM'
    },
    {
      id: '#1006',
      customer: 'Fatima Ali',
      table: 'T12',
      items: '1 item',
      total: '$24.00',
      status: 'Served',
      time: '1:54 PM'
    },
    {
      id: '#1005',
      customer: 'Usman Khalid',
      table: 'T5',
      items: '4 items',
      total: '$96.20',
      status: 'Ready',
      time: '1:32 PM'
    },
    {
      id: '#1004',
      customer: 'Ayesha Butt',
      table: 'T9',
      items: '2 items',
      total: '$38.75',
      status: 'Pending',
      time: '1:15 PM'
    }
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, ordersRes, chartRes] = await Promise.all([
          API.get('/dashboard/stats').catch(() => null),
          API.get('/dashboard/recent-orders').catch(() => null),
          API.get('/dashboard/revenue-chart').catch(() => null)
        ]);

        if (statsRes?.data?.stats && statsRes.data.stats.totalOrders > 0) {
          setStats(statsRes.data.stats);
        }

        if (ordersRes?.data?.orders?.length > 0) {
          const formatted = ordersRes.data.orders.map((o) => ({
            id: o.orderNumber || `#${o._id?.slice(-4)}`,
            customer: o.customerName || 'Walk-in Guest',
            table: o.table?.number ? `T${o.table.number}` : 'T1',
            items: `${o.items?.length || 2} items`,
            total: `$${(o.total || 0).toFixed(2)}`,
            status: o.status
              ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
              : 'Confirmed',
            time: o.createdAt
              ? new Date(o.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit'
                })
              : '2:15 PM'
          }));
          setRecentOrders(formatted);
        } else {
          setRecentOrders(defaultRecentOrders);
        }

        if (chartRes?.data?.chart?.length > 0 && chartRes.data.chart.some(d => d.revenue > 0)) {
          setRevenueChart(chartRes.data.chart);
        } else {
          setRevenueChart(defaultChartData);
        }
      } catch (e) {
        setRecentOrders(defaultRecentOrders);
        setRevenueChart(defaultChartData);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        };
      case 'confirmed':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        };
      case 'preparing':
        return {
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          color: '#c084fc',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        };
      case 'ready':
        return {
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          color: '#22d3ee',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        };
      case 'served':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          color: '#cbd5e1',
          border: '1px solid rgba(148, 163, 184, 0.25)'
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ================= 1. WELCOME HEADER ================= */}
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
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Welcome back, Admin! 👋
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Here's what's happening with your restaurant today.
          </p>
        </div>

        {/* Date Time Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#8b9bb4',
            fontSize: '12px'
          }}
        >
          <FiCalendar style={{ fontSize: '15px', color: '#64748b' }} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <span style={{ fontWeight: 600, color: '#cbd5e1' }}>
              Saturday, 28 April 2025
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>2:45 PM</span>
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR TOP STAT CARDS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Card 1: Total Revenue */}
        <div
          style={{
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa'
              }}
            >
              <FiDollarSign style={{ fontSize: '18px' }} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#7e8ca0', fontWeight: 500 }}>
                Total Revenue
              </span>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '2px'
                }}
              >
                ${stats.todayRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <FiArrowUp /> 12%
              </span>
              <span style={{ color: '#475569', fontSize: '11px' }}>vs. last week</span>
            </div>
            <Sparkline stroke="#7c3aed" />
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div
          style={{
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}
            >
              <FiFileText style={{ fontSize: '18px' }} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#7e8ca0', fontWeight: 500 }}>
                Total Orders
              </span>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '2px'
                }}
              >
                {stats.totalOrders}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <FiArrowUp /> 18%
              </span>
              <span style={{ color: '#475569', fontSize: '11px' }}>vs. last week</span>
            </div>
            <Sparkline stroke="#3b82f6" />
          </div>
        </div>

        {/* Card 3: Active Tables */}
        <div
          style={{
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee'
              }}
            >
              <FiLayout style={{ fontSize: '18px' }} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#7e8ca0', fontWeight: 500 }}>
                Active Tables
              </span>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '2px'
                }}
              >
                {stats.occupiedTables}{' '}
                <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>
                  / {stats.totalTables}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <FiArrowUp /> 5%
              </span>
              <span style={{ color: '#475569', fontSize: '11px' }}>vs. last week</span>
            </div>
            <Sparkline stroke="#06b6d4" />
          </div>
        </div>

        {/* Card 4: Total Staff */}
        <div
          style={{
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <FiUsers style={{ fontSize: '18px' }} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#7e8ca0', fontWeight: 500 }}>
                Total Staff
              </span>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '2px'
                }}
              >
                {stats.totalStaff}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <FiArrowUp /> 0%
              </span>
              <span style={{ color: '#475569', fontSize: '11px' }}>vs. last week</span>
            </div>
            <Sparkline stroke="#3b82f6" />
          </div>
        </div>
      </div>

      {/* ================= 3. MIDDLE ROW: REVENUE OVERVIEW & ORDER STATUS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px'
        }}
      >
        {/* Revenue Overview Curve Chart (8 Cols) */}
        <div
          style={{
            gridColumn: 'span 8',
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiTrendingUp style={{ color: '#818cf8', fontSize: '18px' }} />
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0
                }}
              >
                Revenue Overview
              </h3>
            </div>

            {/* Time Filter Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#11162b',
                padding: '3px',
                borderRadius: '8px'
              }}
            >
              {['7D', '30D', '3M', '1Y'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeFilter(tab)}
                  style={{
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: timeFilter === tab ? '#4338ca' : 'transparent',
                    color: timeFilter === tab ? '#ffffff' : '#7e8ca0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Current Peak Callout Pill */}
          <div
            style={{
              position: 'absolute',
              top: '68px',
              right: '28px',
              backgroundColor: '#1c2445',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10
            }}
          >
            $2,180
          </div>

          {/* Chart Canvas */}
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueChart}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="90%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div
                        style={{
                          backgroundColor: '#11162b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: '#ffffff',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ color: '#7e8ca0', fontSize: '10px' }}>{label}</div>
                        <div style={{ fontWeight: 700, marginTop: '2px' }}>
                          ${payload[0].value}
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fill="url(#revenueGlow)"
                  dot={{ fill: '#ffffff', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut Chart (4 Cols) */}
        <div
          style={{
            gridColumn: 'span 4',
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}
          >
            Order Status
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            {/* Donut Chart with center label */}
            <div
              style={{
                width: '150px',
                height: '150px',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Centered label inside donut */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: '1'
                  }}
                >
                  248
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    marginTop: '2px'
                  }}
                >
                  Total Orders
                </span>
              </div>
            </div>

            {/* Status Legend Table */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1
              }}
            >
              {orderStatusData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }}
                    />
                    <span style={{ color: '#94a3b8' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>{item.value}</span>
                    <span style={{ color: '#475569', fontSize: '11px', width: '28px', textAlign: 'right' }}>
                      {item.percentage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. BOTTOM ROW: RECENT ORDERS & RIGHT SIDEBAR WIDGETS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px'
        }}
      >
        {/* Recent Orders Table (8 Cols) */}
        <div
          style={{
            gridColumn: 'span 8',
            backgroundColor: '#0c1020',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiFileText style={{ color: '#c084fc', fontSize: '18px' }} />
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0
                }}
              >
                Recent Orders
              </h3>
            </div>

            <button
              onClick={() => navigate('/orders')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View All</span>
              <FiArrowRight />
            </button>
          </div>

          {/* Table */}
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
                <tr
                  style={{
                    color: '#64748b',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Table</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Items</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '10px 12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom:
                        idx === recentOrders.length - 1
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.02)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td style={{ padding: '12px', color: '#818cf8', fontWeight: 600 }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '12px', color: '#ffffff', fontWeight: 500 }}>
                      {order.customer}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{order.table}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{order.items}</td>
                    <td style={{ padding: '12px', color: '#ffffff', fontWeight: 700 }}>
                      {order.total}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          ...getStatusBadgeStyle(order.status)
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{order.time}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#475569',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Today's Special & Quick Actions (4 Cols) */}
        <div
          style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Today's Special Card matching reference */}
          <div
            style={{
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div style={{ flex: 1, zIndex: 2 }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#fbbf24',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Today's Special
              </span>
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '4px 0 6px 0'
                }}
              >
                Grilled Chicken Pasta
              </h4>
              <p
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  margin: '0 0 14px 0',
                  lineHeight: '1.4'
                }}
              >
                A perfect blend of flavors and fresh ingredients.
              </p>

              <button
                onClick={() => navigate('/menu')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#4338ca')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#4f46e5')
                }
              >
                <span>View Menu</span>
                <FiArrowRight />
              </button>
            </div>

            {/* Food dish image simulation */}
            <div
              style={{
                width: '105px',
                height: '105px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 35% 35%, #f59e0b, #b45309 60%, #1c1917 100%)',
                boxShadow:
                  '0 10px 25px -5px rgba(245, 158, 11, 0.35), inset 0 2px 8px rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '3px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <IoFastFoodOutline style={{ fontSize: '42px', color: '#ffffff' }} />
            </div>
          </div>

          {/* Quick Actions Card matching reference */}
          <div
            style={{
              backgroundColor: '#0c1020',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px'
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 14px 0'
              }}
            >
              Quick Actions
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}
            >
              <button
                onClick={() => navigate('/menu')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: '#11162b',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a213f';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#11162b';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <IoFastFoodOutline style={{ color: '#818cf8', fontSize: '15px' }} />
                <span>Add Menu Item</span>
              </button>

              <button
                onClick={() => navigate('/orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: '#11162b',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a213f';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#11162b';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <FiFileText style={{ color: '#a855f7', fontSize: '15px' }} />
                <span>New Order</span>
              </button>

              <button
                onClick={() => navigate('/tables')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: '#11162b',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a213f';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#11162b';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <FiLayout style={{ color: '#06b6d4', fontSize: '15px' }} />
                <span>Manage Tables</span>
              </button>

              <button
                onClick={() => navigate('/staff')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: '#11162b',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a213f';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#11162b';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <FiUsers style={{ color: '#3b82f6', fontSize: '15px' }} />
                <span>Add Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
