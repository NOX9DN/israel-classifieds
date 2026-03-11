'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [category, setCategory] = useState('all')
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'auto', city: '', phone: ''
  })

  useEffect(() => { fetchListings() }, [category])

  async function fetchListings() {
    setLoading(true)
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (category !== 'all') query = query.eq('category', category)
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  async function submitListing() {
    if (!form.title || !form.phone) return alert('Заполни заголовок и телефон!')
    const { error } = await supabase.from('listings').insert([form])
    if (error) return alert('Ошибка: ' + error.message)
    setShowModal(false)
    setForm({ title: '', description: '', price: '', category: 'auto', city: '', phone: '' })
    fetchListings()
    alert('✅ Объявление опубликовано!')
  }

  const cats = [
    { id: 'all', label: '🌐 Все' },
    { id: 'auto', label: '🚗 Авто' },
    { id: 'realty', label: '🏠 Жильё' },
    { id: 'jobs', label: '💼 Работа' },
    { id: 'services', label: '🛠️ Услуги' },
  ]

  const cityEmoji = { 'Тель-Авив':'🏙️', 'Хайфа':'⚓', 'Иерусалим':'🕍', 'Нетания':'🌊', 'Ришон':'🌳' }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f4f6fb', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#0057B8', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: 'white', fontWeight: 900, fontSize: '20px' }}>🇮🇱 Израил.ру</div>
        <button onClick={() => setShowModal(true)} style={{ background: '#FFD700', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
          + Подать объявление
        </button>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #003d8a, #0057B8)', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '28px', margin: '0 0 8px' }}>Объявления для <span style={{ color: '#FFD700' }}>русскоязычного Израиля</span></h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 24px' }}>Покупай, продавай, находи работу — всё на русском</p>
        <input placeholder="🔍 Поиск объявлений..." style={{ width: '100%', maxWidth: '500px', padding: '14px 20px', borderRadius: '12px', border: 'none', fontSize: '15px', outline: 'none' }} />
      </div>

      {/* CATEGORIES */}
      <div style={{ display: 'flex', gap: '10px', padding: '20px 24px', overflowX: 'auto' }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{ background: category === c.id ? '#0057B8' : 'white', color: category === c.id ? 'white' : '#333', border: '2px solid', borderColor: category === c.id ? '#0057B8' : '#e5e8f0', borderRadius: '20px', padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* LISTINGS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Загружаем объявления...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px' }}>📭</div>
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Объявлений пока нет. Будь первым!</p>
            <button onClick={() => setShowModal(true)} style={{ background: '#0057B8', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', marginTop: '16px', cursor: 'pointer', fontWeight: 700 }}>
              + Подать объявление
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {listings.map(l => (
              <div key={l.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '2px solid', borderColor: l.is_vip ? '#FFD700' : '#e5e8f0', boxShadow: l.is_vip ? '0 4px 20px rgba(255,215,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                {l.is_vip && <div style={{ background: '#FFD700', color: '#1a1200', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '10px' }}>⭐ VIP</div>}
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{l.title}</div>
                {l.description && <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '10px', lineHeight: '1.4' }}>{l.description}</div>}
                {l.price && <div style={{ color: '#0057B8', fontWeight: 900, fontSize: '20px', marginBottom: '10px' }}>₪ {Number(l.price).toLocaleString()}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>📍 {l.city || 'Израиль'}</span>
                  <a href={`https://wa.me/${l.phone}`} target="_blank" style={{ background: '#25D366', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div onClick={(e) => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>📝 Подать объявление</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f4f6fb', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            {[
              { label: 'Заголовок *', key: 'title', placeholder: 'Например: Toyota Camry 2020' },
              { label: 'Описание', key: 'description', placeholder: 'Подробности, состояние...' },
              { label: 'Цена (₪)', key: 'price', placeholder: '85000', type: 'number' },
              { label: 'Город', key: 'city', placeholder: 'Тель-Авив' },
              { label: 'WhatsApp *', key: 'phone', placeholder: '972501234567' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  style={{ width: '100%', border: '2px solid #e5e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px' }}>Категория</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', border: '2px solid #e5e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none' }}>
                <option value="auto">🚗 Авто</option>
                <option value="realty">🏠 Жильё</option>
                <option value="jobs">💼 Работа</option>
                <option value="services">🛠️ Услуги</option>
              </select>
            </div>

            <button onClick={submitListing} style={{ width: '100%', background: '#0057B8', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              🚀 Опубликовать бесплатно
            </button>
          </div>
        </div>
      )}
    </div>
  )
}