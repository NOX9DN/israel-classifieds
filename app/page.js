'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/useLang'
import { supabase } from '@/app/supabase'
import Link from 'next/link'

// ─── Geometric canvas animation ───────────────────────────────────────────────
function HeroCanvas() {
  const ref = useRef()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const NAVY = '#1B2D6B'
    let W, H, nodes = [], t = 0, raf
    const COLS = 9, ROWS = 5

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      nodes = []
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          nodes.push({
            bx: (c / (COLS - 1)) * W,
            by: (r / (ROWS - 1)) * H,
            x: 0, y: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.004 + Math.random() * 0.004,
            amp:   8 + Math.random() * 14,
            size:  1.2 + Math.random() * 1.4,
            alpha: 0.12 + Math.random() * 0.22,
          })
        }
      }
    }

    function getNeighbours(i) {
      const nb = [], r = Math.floor(i / COLS), c = i % COLS
      if (c + 1 < COLS) nb.push(i + 1)
      if ((r + 1) * COLS + c < nodes.length) nb.push(i + COLS)
      if (c + 1 < COLS && (r + 1) * COLS + c + 1 < nodes.length) nb.push(i + COLS + 1)
      return nb
    }

    function frame() {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#F8F6F0'
      ctx.fillRect(0, 0, W, H)

      nodes.forEach(n => {
        n.x = n.bx + Math.sin(t * n.speed + n.phase) * n.amp
        n.y = n.by + Math.cos(t * n.speed * .7 + n.phase + 1) * n.amp * .6
      })

      nodes.forEach((n, i) => {
        getNeighbours(i).forEach(j => {
          const m = nodes[j]
          const dist = Math.hypot(n.x - m.x, n.y - m.y)
          const maxDist = Math.hypot(W / (COLS - 1), H / 4) * 1.6
          const alpha = Math.min(t / 120, 1) * (1 - dist / maxDist) * 0.13
          if (alpha <= 0) return
          ctx.beginPath()
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(m.x, m.y)
          ctx.strokeStyle = `rgba(27,45,107,${alpha})`
          ctx.lineWidth = .8
          ctx.stroke()
        })
      })

      nodes.forEach((n, i) => {
        const a = Math.min(t / 80, 1) * n.alpha
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(27,45,107,${a})`
        ctx.fill()

        if (i % 11 === 0) {
          const pulse = .5 + .5 * Math.sin(t * .03 + n.phase)
          const pa = Math.min(t / 80, 1) * pulse * 0.5
          ctx.beginPath()
          ctx.arc(n.x, n.y, 3 + pulse * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(44,69,160,${pa * .3})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(44,69,160,${pa})`
          ctx.fill()
        }
      })

      t++
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    frame()

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

// ─── Listing Card ──────────────────────────────────────────────────────────────
function ListingCard({ item, delay }) {
  const [fav, setFav] = useState(false)

  function formatPrice(n) {
    if (!n) return '—'
    return '₪ ' + Number(n).toLocaleString('ru-RU')
  }

  function timeAgo(dateStr) {
    if (!dateStr) return ''
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 86400)  return 'Сегодня'
    if (diff < 172800) return 'Вчера'
    return `${Math.floor(diff / 86400)} дн.`
  }

  const catIcon = { auto:'🚗', housing:'🏠', jobs:'💼' }
  const icon = item.icon || catIcon[item.category] || '📋'

  // Ссылка на страницу объявления
  const href = item.category === 'auto'
    ? `/auto/${item.id}`
    : item.category === 'housing'
    ? `/housing/${item.id}`
    : `/jobs/${item.id}`

  return (
    <Link href={href} className="card-link">
      <div className="card" style={{ animationDelay: `${delay}s` }}>
        <div className="card-img">
          <span>{icon}</span>
          {item.vip && <div className="badge-vip">⭐ VIP</div>}
          <button className="btn-fav" onClick={e => { e.preventDefault(); setFav(!fav) }}>
            {fav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="card-body">
          <div className="card-price">{formatPrice(item.price)}</div>
          <div className="card-title">{item.title}</div>
          <div className="card-tags">
            {item.city && <span className="tag">{item.city}</span>}
            {item.category && <span className="tag">{{ auto:'Авто', housing:'Жильё', jobs:'Работа' }[item.category] || item.category}</span>}
          </div>
          <div className="card-footer">
            <span className="card-loc">📍 {item.city || '—'} · {timeAgo(item.created_at)}</span>
            <button
              className="wa-btn"
               onClick={e => {
                 e.preventDefault()
                 e.stopPropagation()
                 window.open(`https://wa.me/${(item.phone||'').replace(/\D/g,'')}`, '_blank')
  }}
>💬 WA</button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard({ delay }) {
  return (
    <div className="card skeleton-card" style={{ animationDelay: `${delay}s` }}>
      <div className="sk-img"/>
      <div className="card-body">
        <div className="sk-line sk-price"/>
        <div className="sk-line sk-title"/>
        <div className="sk-tags"><div className="sk-tag"/><div className="sk-tag"/></div>
        <div className="sk-line sk-footer"/>
      </div>
    </div>
  )
}

// ─── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ open, onClose, t }) {
  const [tab, setTab] = useState('login')
  if (!open) return null
  return (
    <div className="overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{t('auth_welcome')}</h2>
        <p className="modal-sub">{t('auth_subtitle')}</p>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>{t('auth_tab_login')}</button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>{t('auth_tab_register')}</button>
        </div>
        {tab === 'login' ? (
          <>
            <div className="f-group"><label className="f-label">{t('auth_phone_email')}</label><input className="f-input" placeholder="+972 50 000 0000" /></div>
            <div className="f-group"><label className="f-label">{t('auth_password')}</label><input className="f-input" type="password" placeholder="••••••••" /></div>
            <button className="f-submit">{t('auth_btn_login')}</button>
            <div className="f-divider">{t('auth_or')}</div>
            <button className="btn-wa-auth">💬 {t('auth_wa_login')}</button>
          </>
        ) : (
          <>
            <div className="f-group"><label className="f-label">{t('auth_name')}</label><input className="f-input" placeholder={t('auth_name_placeholder')} /></div>
            <div className="f-group"><label className="f-label">{t('auth_phone')}</label><input className="f-input" placeholder="+972 50 000 0000" /></div>
            <div className="f-group"><label className="f-label">{t('auth_password')}</label><input className="f-input" type="password" placeholder={t('auth_password_min')} /></div>
            <button className="f-submit">{t('auth_btn_register')}</button>
            <div className="f-divider">{t('auth_or')}</div>
            <button className="btn-wa-auth">💬 {t('auth_wa_register')}</button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Post Modal ────────────────────────────────────────────────────────────────
function PostModal({ open, onClose, onSubmit, t }) {
  const [form, setForm] = useState({ title:'', price:'', city:'', category:'auto', description:'', phone:'' })
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleSubmit() {
    if (!form.title || !form.phone) return
    setLoading(true)
    try {
      const { error } = await supabase.from('listings').insert({
        title:       form.title,
        price:       form.price ? parseInt(form.price) : null,
        city:        form.city,
        category:    form.category,
        description: form.description,
        phone:       form.phone,
        status:      'pending',
        vip:         false,
      })
      if (error) throw error
      onSubmit()
      setForm({ title:'', price:'', city:'', category:'auto', description:'', phone:'' })
    } catch (err) {
      console.error('Post error:', err)
      alert('Ошибка при подаче объявления')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-post">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{t('post_title')}</h2>
        <p className="modal-sub">{t('post_subtitle')}</p>
        <div className="f-group">
          <label className="f-label">{t('post_field_title')}</label>
          <input className="f-input" placeholder={t('post_field_title_ph')} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
        </div>
        <div className="f-row">
          <div className="f-group">
            <label className="f-label">{t('post_field_price')}</label>
            <input className="f-input" type="number" placeholder="0" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
          </div>
          <div className="f-group">
            <label className="f-label">{t('post_field_city')}</label>
            <select className="f-sel" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}>
              <option value="">Выберите город</option>
              {['city_tlv','city_haifa','city_jerusalem','city_netanya','city_rishon','city_beer_sheva'].map(k => (
                <option key={k} value={t(k)}>{t(k)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="f-group">
          <label className="f-label">{t('post_field_category')}</label>
          <select className="f-sel" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            <option value="auto">{t('cat_auto')}</option>
            <option value="housing">{t('cat_housing')}</option>
            <option value="jobs">{t('cat_jobs')}</option>
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">{t('post_field_desc')}</label>
          <input className="f-input" placeholder={t('post_field_desc_ph')} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
        </div>
        <div className="f-group">
          <label className="f-label">{t('post_field_wa')}</label>
          <input className="f-input" placeholder="+972 50 000 0000" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
        </div>
        <button className="f-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Отправляем...' : t('post_btn')}
        </button>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { t, lang, switchLang } = useLang()
  const [authOpen, setAuthOpen] = useState(false)
  const [postOpen, setPostOpen] = useState(false)
  const [toast,    setToast]    = useState('')
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [sort,     setSort]     = useState('new')

  useEffect(() => { fetchListings() }, [sort])

  async function fetchListings() {
    setLoading(true)
    try {
      let q = supabase
        .from('listings')
        .select('id, title, price, city, category, phone, vip, created_at, icon')
        .eq('status', 'active')
        .limit(9)

      if (sort === 'cheap')     q = q.order('vip', { ascending: false }).order('price', { ascending: true })
      else if (sort === 'expensive') q = q.order('vip', { ascending: false }).order('price', { ascending: false })
      else                      q = q.order('vip', { ascending: false }).order('created_at', { ascending: false })

      const { data, error } = await q
      if (error) throw error
      setListings(data || [])
    } catch (err) {
      console.error('Supabase error:', err)
    } finally {
      setLoading(false)
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav>
        <a className="logo" href="#">Израил<span>.</span>ру</a>
        <div className="nav-right">
          <div className="lang-switch">
            <button className={`lang-btn${lang === 'ru' ? ' active' : ''}`} onClick={() => switchLang('ru')}>РУ</button>
            <button className={`lang-btn${lang === 'he' ? ' active' : ''}`} onClick={() => switchLang('he')}>עב</button>
          </div>
          <button className="btn-fav-nav" title="Избранное">♡ <span className="fav-count">0</span></button>
          <button className="btn-login" onClick={() => setAuthOpen(true)}>{t('nav_login')}</button>
          <button className="btn-post"  onClick={() => setPostOpen(true)}>{t('nav_post')}</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-content">
          <h1>{t('hero_title_1')}<br /><em>{t('hero_title_2')}</em></h1>
          <div className="search-box">
            <select className="s-seg">
              <option>{t('hero_search_all')}</option>
              <option>{t('hero_search_auto')}</option>
              <option>{t('hero_search_housing')}</option>
              <option>{t('hero_search_jobs')}</option>
            </select>
            <input className="s-input" type="text" placeholder={t('hero_search_placeholder')} />
            <select className="s-seg city">
              <option value="">{t('hero_search_city_all')}</option>
              {['city_tlv','city_haifa','city_jerusalem','city_netanya','city_rishon','city_beer_sheva','city_ashdod','city_petah','city_ramat_gan','city_bat_yam'].map(k => (
                <option key={k}>{t(k)}</option>
              ))}
            </select>
            <button className="s-btn">{t('hero_search_btn')}</button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="main">

        {/* CATEGORY TILES */}
        <div className="cat-tiles">
          {[
            { icon:'🚗', nameKey:'cat_auto',    descKey:'cat_auto_desc',    href:'/auto'    },
            { icon:'🏠', nameKey:'cat_housing', descKey:'cat_housing_desc', href:'/housing' },
            { icon:'💼', nameKey:'cat_jobs',    descKey:'cat_jobs_desc',    href:'/jobs'    },
          ].map(cat => (
            <a key={cat.nameKey} className="cat-tile" href={cat.href}>
              <div className="ct-icon">{cat.icon}</div>
              <div className="ct-name">{t(cat.nameKey)}</div>
              <div className="ct-desc">{t(cat.descKey)}</div>
              <div className="ct-arrow">→</div>
            </a>
          ))}
        </div>

        {/* CARDS */}
        <div className="cards-hd">
          <div className="cards-label">{t('listings_title')}</div>
          <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="new">{t('listings_sort_new')}</option>
            <option value="cheap">{t('listings_sort_cheap')}</option>
            <option value="expensive">{t('listings_sort_expensive')}</option>
          </select>
        </div>

        <div className="cards-grid">
          {loading
            ? Array(9).fill(0).map((_,i) => <SkeletonCard key={i} delay={0.04*(i+1)}/>)
            : listings.map((item, i) => <ListingCard key={item.id} item={item} delay={0.04*(i+1)}/>)
          }
        </div>

        {!loading && listings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-title">Пока нет объявлений</p>
            <p className="empty-sub">Будьте первым — подайте объявление!</p>
            <button className="btn-post-lg" onClick={() => setPostOpen(true)}>+ Подать объявление</button>
          </div>
        )}

        {listings.length > 0 && (
          <div className="load-more-wrap">
            <button className="load-more">{t('listings_load_more')}</button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a className="logo-footer" href="#">Израил<span>.</span>ру</a>
            <p>{t('footer_desc')}</p>
            <a className="footer-wa" href="#">💬 {t('footer_contact_wa')}</a>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col_sections')}</h4>
            <a href="/auto">{t('cat_auto')}</a>
            <a href="/housing">{t('cat_housing')}</a>
            <a href="/jobs">{t('cat_jobs')}</a>
            <a href="#" onClick={e => { e.preventDefault(); setPostOpen(true) }}>{t('nav_post')}</a>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col_account')}</h4>
            <a href="#" onClick={e => { e.preventDefault(); setAuthOpen(true) }}>{t('nav_login')}</a>
            <a href="#" onClick={e => { e.preventDefault(); setAuthOpen(true) }}>{t('auth_tab_register')}</a>
            <a href="#">{t('footer_my_listings')}</a>
            <a href="#">{t('footer_favorites')}</a>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col_company')}</h4>
            <a href="#">{t('footer_about')}</a>
            <a href="#">{t('footer_contacts')}</a>
            <a href="#">{t('footer_privacy')}</a>
            <a href="#">{t('footer_terms')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">{t('footer_copy')}</div>
          <div className="footer-legal">
            <a href="#">{t('footer_privacy')}</a>
            <a href="#">{t('footer_terms')}</a>
            <a href="#">{t('footer_rules')}</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} t={t} />
      <PostModal
        open={postOpen}
        onClose={() => setPostOpen(false)}
        onSubmit={() => { showToast(t('toast_posted')); setPostOpen(false); fetchListings() }}
        t={t}
      />

      {/* WA FLOAT */}
      <button className="wa-btn" onClick={e=>{
        e.preventDefault()
        e.stopPropagation()
        window.open(`https://wa.me/${(item.phone||'').replace(/\D/g,'')}`, '_blank')
      }}>💬 WA</button>
      {/* TOAST */}
      {toast && <div className="toast show">{toast}</div>}
    </>
  )
}

// ─── CSS (без изменений) ───────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --cream:     #F8F6F0;
  --cream2:    #F0EDE4;
  --cream3:    #E6E1D4;
  --navy:      #1B2D6B;
  --navy-mid:  #2C45A0;
  --navy-lt:   #4A6FD4;
  --navy-dim:  rgba(27,45,107,0.07);
  --navy-dim2: rgba(27,45,107,0.04);
  --gold:      #B8892A;
  --text:      #1A1A2E;
  --muted:     #8A8AA8;
  --border:    rgba(27,45,107,0.1);
  --radius:    16px;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:var(--cream);color:var(--text);}
nav{position:sticky;top:0;z-index:200;height:68px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(248,246,240,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.logo{font-family:'Playfair Display',serif;font-weight:900;font-size:23px;color:var(--navy);text-decoration:none;letter-spacing:-0.3px;}
.logo span{color:var(--navy-mid);}
.nav-right{display:flex;align-items:center;gap:8px;}
.lang-switch{display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;}
.lang-btn{background:transparent;border:none;padding:6px 12px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;}
.lang-btn.active{background:var(--navy);color:white;}
.btn-post{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 22px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:.2s;}
.btn-post:hover{background:var(--navy-mid);}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.btn-login:hover{border-color:var(--navy);background:var(--navy-dim);}
.btn-fav-nav{display:flex;align-items:center;gap:5px;background:transparent;border:1.5px solid var(--border);border-radius:10px;padding:9px 14px;font-size:14px;cursor:pointer;transition:all .2s;color:var(--text);}
.btn-fav-nav:hover{border-color:var(--navy);}
.fav-count{font-size:12px;font-weight:700;color:var(--muted);font-family:'Inter',sans-serif;}

.hero{position:relative;height:420px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.hero-content{position:relative;z-index:1;text-align:center;padding:0 24px;}
.hero-content h1{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,58px);font-weight:900;color:var(--navy);line-height:1.1;letter-spacing:-1px;margin-bottom:32px;}
.hero-content em{font-style:italic;color:var(--navy-mid);}
.search-box{display:flex;align-items:center;background:white;border:2px solid var(--border);border-radius:14px;padding:6px;gap:6px;box-shadow:0 8px 40px rgba(27,45,107,0.1);max-width:680px;margin:0 auto;}
.s-seg{border:none;background:transparent;padding:10px 14px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--navy);cursor:pointer;outline:none;border-right:1px solid var(--border);}
.s-seg.city{border-right:none;border-left:1px solid var(--border);}
.s-input{flex:1;border:none;background:transparent;padding:10px 14px;font-family:'Inter',sans-serif;font-size:14px;color:var(--text);outline:none;}
.s-btn{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 28px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:.2s;white-space:nowrap;}
.s-btn:hover{background:var(--navy-mid);}

.main{max-width:1100px;margin:0 auto;padding:0 32px;}
.cat-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:40px 0 32px;}
.cat-tile{background:white;border:1.5px solid var(--border);border-radius:var(--radius);padding:24px;text-decoration:none;color:var(--text);transition:all .25s;display:flex;flex-direction:column;gap:6px;box-shadow:0 2px 12px rgba(27,45,107,0.04);}
.cat-tile:hover{border-color:var(--navy-lt);transform:translateY(-4px);box-shadow:0 12px 40px rgba(27,45,107,0.1);}
.ct-icon{font-size:28px;margin-bottom:4px;}
.ct-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--navy);}
.ct-desc{font-size:12px;color:var(--muted);line-height:1.5;}
.ct-arrow{font-size:18px;color:var(--navy-lt);margin-top:auto;padding-top:8px;}
.cards-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.cards-label{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);}
.sort-sel{background:white;border:1.5px solid var(--border);border-radius:8px;padding:8px 13px;font-family:'Inter',sans-serif;font-size:12px;color:var(--text);outline:none;cursor:pointer;}
.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:16px;}
.card-link{text-decoration:none;color:inherit;display:block;}
.card{background:white;border:1.5px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .25s;box-shadow:0 2px 12px rgba(27,45,107,0.05);animation:fadeUp .5s ease both;}
.card:hover{border-color:var(--navy-lt);transform:translateY(-5px);box-shadow:0 20px 50px rgba(27,45,107,0.12);}
.card-img{height:168px;background:linear-gradient(135deg,var(--cream2) 0%,var(--cream3) 100%);display:flex;align-items:center;justify-content:center;font-size:54px;position:relative;}
.badge-vip{position:absolute;top:10px;left:10px;background:var(--gold);color:white;font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;}
.btn-fav{position:absolute;top:10px;right:10px;background:white;border:1px solid var(--border);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:transform .2s;}
.btn-fav:hover{transform:scale(1.15);}
.card-body{padding:13px 15px 15px;}
.card-price{font-family:'Playfair Display',serif;font-size:21px;font-weight:700;color:var(--navy);margin-bottom:4px;letter-spacing:-.5px;direction:ltr;unicode-bidi:embed;}
.card-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:11px;direction:ltr;unicode-bidi:embed;}
.tag{background:var(--navy-dim);color:var(--navy-mid);font-size:10px;font-weight:600;padding:3px 8px;border-radius:5px;}
.card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border);}
.card-loc{font-size:11px;color:var(--muted);direction:ltr;unicode-bidi:embed;}
.wa-btn{background:#22C55E;color:white;border:none;cursor:pointer;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;}
.empty-state{text-align:center;padding:60px 20px;}
.empty-icon{font-size:48px;margin-bottom:16px;}
.empty-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty-sub{font-size:14px;color:var(--muted);margin-bottom:24px;}
.btn-post-lg{background:var(--navy);color:white;border:none;border-radius:12px;padding:12px 32px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}
.load-more-wrap{text-align:center;padding:16px 0 64px;}
.load-more{background:transparent;border:1.5px solid var(--border);border-radius:12px;padding:13px 44px;color:var(--muted);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.load-more:hover{border-color:var(--navy);color:var(--navy);}

/* Скелетон */
.skeleton-card{pointer-events:none;}
.sk-img{height:168px;background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
.sk-line{height:14px;border-radius:6px;background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;margin-bottom:10px;}
.sk-price{height:22px;width:60%;}
.sk-title{width:85%;}
.sk-tags{display:flex;gap:6px;margin-bottom:11px;}
.sk-tag{height:20px;width:56px;border-radius:5px;background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
.sk-footer{width:70%;margin-bottom:0;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

footer{background:var(--navy);margin-top:40px;}
.footer-top{max-width:1100px;margin:0 auto;padding:48px 32px 32px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px;}
.footer-brand p{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7;margin:12px 0 16px;}
.logo-footer{font-family:'Playfair Display',serif;font-weight:900;font-size:20px;color:white;text-decoration:none;}
.logo-footer span{color:rgba(147,197,253,0.8);}
.footer-wa{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,0.15);color:#4ade80;text-decoration:none;padding:8px 16px;border-radius:9px;font-size:13px;font-weight:600;border:1px solid rgba(34,197,94,0.2);}
.footer-col h4{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px;}
.footer-col a{display:block;font-size:13px;color:rgba(255,255,255,0.4);text-decoration:none;margin-bottom:8px;transition:.2s;}
.footer-col a:hover{color:rgba(255,255,255,0.8);}
.footer-bottom{max-width:1100px;margin:0 auto;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:rgba(255,255,255,0.25);}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;}
.footer-legal a:hover{color:rgba(255,255,255,0.6);}

.overlay{position:fixed;inset:0;background:rgba(27,45,107,0.55);backdrop-filter:blur(12px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .25s;}
.overlay.open{opacity:1;pointer-events:all;}
.modal{background:white;border-radius:20px;padding:36px;width:100%;max-width:420px;position:relative;box-shadow:0 32px 80px rgba(27,45,107,0.2);}
.modal-post{max-width:500px;}
.modal-close{position:absolute;top:16px;right:16px;background:var(--cream);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:14px;color:var(--muted);}
.modal h2{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--navy);margin-bottom:4px;}
.modal-sub{font-size:13px;color:var(--muted);margin-bottom:20px;}
.auth-tabs{display:flex;background:var(--cream);border-radius:10px;padding:4px;margin-bottom:20px;}
.auth-tab{flex:1;border:none;background:transparent;padding:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;border-radius:8px;transition:.2s;}
.auth-tab.active{background:white;color:var(--navy);box-shadow:0 2px 8px rgba(27,45,107,0.1);}
.f-group{margin-bottom:14px;}
.f-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.f-label{display:block;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;}
.f-input,.f-sel{width:100%;background:var(--cream);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);outline:none;transition:.2s;}
.f-input:focus,.f-sel:focus{border-color:var(--navy-lt);background:white;}
.f-submit{width:100%;background:var(--navy);color:white;border:none;border-radius:10px;padding:13px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:.2s;margin-top:6px;}
.f-submit:hover{background:var(--navy-mid);}
.f-submit:disabled{opacity:0.6;cursor:default;}
.f-divider{text-align:center;font-size:12px;color:var(--muted);margin:14px 0;position:relative;}
.f-divider::before,.f-divider::after{content:'';position:absolute;top:50%;width:40%;height:1px;background:var(--border);}
.f-divider::before{left:0;}.f-divider::after{right:0;}
.btn-wa-auth{width:100%;background:#22C55E;color:white;border:none;border-radius:10px;padding:12px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;}

.wa-float{position:fixed;bottom:28px;right:28px;width:52px;height:52px;background:#22C55E;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;text-decoration:none;box-shadow:0 4px 20px rgba(34,197,94,0.4);z-index:100;transition:.2s;}
.wa-float:hover{transform:scale(1.1);}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--navy);color:white;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:600;box-shadow:0 8px 32px rgba(27,45,107,0.3);}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:900px){.cards-grid{grid-template-columns:1fr 1fr}.cat-tiles{grid-template-columns:1fr 1fr 1fr}.footer-top{grid-template-columns:1fr 1fr;gap:24px}}
@media(max-width:640px){nav{padding:0 16px}.main{padding:0 16px}.hero-content h1{font-size:28px}.search-box{flex-wrap:wrap}.cards-grid{grid-template-columns:1fr}.cat-tiles{grid-template-columns:1fr}.footer-top{grid-template-columns:1fr}}
`
