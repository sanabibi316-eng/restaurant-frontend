import { useState, useEffect } from 'react';
import API, { BACKEND_URL } from '../api/axios';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiImage,
  FiClock,
  FiTag
} from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: false,
    preparationTime: 15,
    discount: 0
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const fetchItems = async () => {
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      if (filterCat) params.category = filterCat;

      const { data } = await API.get('/menu', { params });
      setItems(data.items || []);
    } catch {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories?active=true');
      setCategories(data.categories || []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [search, filterCat]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      isVeg: false,
      preparationTime: 15,
      discount: 0
    });
    setImage(null);
    setPreview('');
    setModal(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category?._id || item.category || '',
      isVeg: !!item.isVeg,
      preparationTime: item.preparationTime || 15,
      discount: item.discount || 0
    });
    setPreview(item.image ? `${BACKEND_URL}` : '');
    setImage(null);
    setModal(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.price) return toast.error('Price is required');
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.category) fd.append('category', form.category);
      fd.append('isVeg', form.isVeg);
      fd.append('preparationTime', form.preparationTime);
      fd.append('discount', form.discount);
      if (image) fd.append('image', image);

      if (editId) {
        await API.put(`/menu/${editId}`, fd);
        toast.success('Menu item updated');
      } else {
        await API.post('/menu', fd);
        toast.success('Menu item created');
      }
      setModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await API.put(`/menu/${item._id}`, { isAvailable: !item.isAvailable });
      toast.success(`${item.name} is now ${!item.isAvailable ? 'Available' : 'Sold out'}`);
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish?')) return;
    try {
      await API.delete(`/menu/${id}`);
      toast.success('Dish removed from menu');
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

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
            Restaurant Menu
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Manage food dishes, beverages, pricing, and availability
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
          <span>Add Dish</span>
        </button>
      </div>

      {/* Category Pills & Search */}
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
          <button
            onClick={() => setFilterCat('')}
            style={{
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: filterCat === '' ? '#4338ca' : 'transparent',
              color: filterCat === '' ? '#ffffff' : '#8b9bb4'
            }}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setFilterCat(c._id)}
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterCat === c._id ? '#4338ca' : 'transparent',
                color: filterCat === c._id ? '#ffffff' : '#8b9bb4'
              }}
            >
              {c.name}
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
            placeholder="Search dish name..."
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

      {/* Grid of Dishes */}
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
      ) : items.length === 0 ? (
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
          <IoFastFoodOutline style={{ fontSize: '36px', opacity: 0.3, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '13px' }}>No menu dishes found</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: '#0c1020',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '18px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
            >
              {/* Image banner */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '12px',
                  backgroundColor: '#11162b',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  position: 'relative'
                }}
              >
                {item.image ? (
                  <img
                    src={`${BACKEND_URL}`}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <IoFastFoodOutline style={{ fontSize: '42px', color: '#334155' }} />
                )}

                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '4px'
                  }}
                >
                  <button
                    onClick={() => openEdit(item)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(10, 13, 24, 0.85)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Edit"
                  >
                    <FiEdit2 style={{ fontSize: '13px' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      backgroundColor: 'rgba(10, 13, 24, 0.85)',
                      color: '#fb7185',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Delete"
                  >
                    <FiTrash2 style={{ fontSize: '13px' }} />
                  </button>
                </div>
              </div>

              {/* Title & Price */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {item.name}
                  </h3>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap' }}>
                    ${item.price}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#7e8ca0',
                    margin: '6px 0 0 0',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {item.description || 'Delicious freshly prepared recipe'}
                </p>
              </div>

              {/* Meta pills & Stock toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      color: '#818cf8'
                    }}
                  >
                    {item.category?.name || 'General'}
                  </span>
                  {item.preparationTime && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      ⏱ {item.preparationTime}m
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleAvailability(item)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: item.isAvailable !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    color: item.isAvailable !== false ? '#34d399' : '#fb7185'
                  }}
                >
                  {item.isAvailable !== false ? 'In Stock' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
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
              maxWidth: '520px',
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
                {editId ? 'Edit Dish' : 'Add New Dish'}
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
                  Dish Title *
                </label>
                <input
                  required
                  placeholder="e.g. Grilled Chicken Pasta"
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
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="18.50"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, spice level, or culinary notes..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#11162b',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Upload Dish Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ fontSize: '12px', color: '#94a3b8' }}
                />
                {preview && (
                  <div style={{ marginTop: '10px', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
                    <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
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
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Publish Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
