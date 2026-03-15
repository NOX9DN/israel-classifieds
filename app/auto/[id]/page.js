'use client'

import { useState, useEffect, use } from 'react'
import { useLang } from '@/lib/useLang'
import { supabase } from '@/app/supabase'
import Link from 'next/link'

// ─── GALLERY ───────────────────────────────────────────────────────────────────
function Gallery({ icon }) {
  const [active, setActive] = useState(0)
  const slides = [icon, icon, icon, icon]
  return (
    <div className="gallery">
      <div className="gallery-main">
        <div className="gallery-main-img">{slides[active]}</div>
        <button className="gallery-nav gallery-prev" onClick={()=>setActive(a=>Math.max(0,a-1))}>‹</button>
        <button className="gallery-nav gallery-next" onClick={()=>setActive(a=>Math.min(slides.length-1,a+1))}>›</button>
        <div className="gallery-counter">{active+1} / {slides.length}</div>
      </div>
      <div className="gallery-thumbs">
        {slides.map((s,i)=>(
          <div key={i} className={`gallery-thumb${active===i?' active':''}`} onClick={()=>setActive(i)}>{s}</div>
        ))}
      </div>
    </div>
  )
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="listing-wrap">
      <div className="listing-main">
        <div className="sk-gallery"/>
        <div className="sk-line sk-title-line"/>
        <div className="sk-line sk-meta-line"/>
        <div className="sk-line sk-desc-line"/>
        <div className="sk-line sk-desc-line" style={{width:'80%'}}/>
      </div>
      <div className="listing-sidebar">
        <div className="sk-price-card"/>
      </div>
    </div>
  )
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function ListingPage({ params }) {
  const { id } = use(params)
  const { lang, switchLang } = useLang()
  const [listing,  setListing]  = useState(null)
  const [similar,  setSimilar]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [favd,     setFavd]     = useState(false)

  useEffect(() => {
    if (id) fetchListing(id)
  }, [id])

  async function fetchListing(id) {
    setLoading(true)
    try {
      // Основное объявление
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single()

      if (error || !data) { setNotFound(true); return }

      setListing(data)

      // Инкремент просмотров
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      // Похожие — та же категория, не этот же id
      const { data: sim } = await supabase
        .from('listings')
        .select('id, title, price, city, icon, category, created_at')
        .eq('category', data.category)
        .eq('status', 'active')
        .neq('id', id)
        .order('vip', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3)

      setSimilar(sim || [])
    } catch (err) {
      console.error('Fetch error:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(n) {
    if (!n) return '—'
    return '₪ ' + Number(n).toLocaleString('ru-RU')
  }

  function timeAgo(dateStr) {
    if (!dateStr) return ''
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 86400)  return 'Сегодня'
    if (diff < 172800) return 'Вчера'
    return `${Math.floor(diff / 86400)} дн. назад`
  }

  // Данные с фоллбэком на разные названия полей
  const icon      = listing?.icon || '🚗'
  const brand     = listing?.brand || listing?.title?.split(' ')[0] || '—'
  const model     = listing?.model || listing?.title?.split(' ').slice(1,3).join(' ') || ''
  const year      = listing?.year || ''
  const km        = listing?.mileage || listing?.km || 0
  const hp        = listing?.horsepower || listing?.hp || 0
  const phone     = listing?.phone || ''
  const sellerName = listing?.seller_name || listing?.phone || 'Продавец'

  const specs = listing ? [
    { label: 'Марка',     value: brand },
    { label: 'Модель',    value: model },
    { label: 'Год',       value: year  },
    { label: 'Кузов',     value: listing.body_type   || listing.body   || '—' },
    { label: 'Топливо',   value: listing.fuel_type   || listing.fuel   || '—' },
    { label: 'КПП',       value: listing.transmission|| listing.trans  || '—' },
    { label: 'Привод',    value: listing.drive_type  || listing.drive  || '—' },
    { label: 'Мощность',  value: hp ? `${hp} л.с.`  : '—' },
    { label: 'Пробег',    value: km ? `${km.toLocaleString()} км` : '—' },
    { label: 'Цвет',      value: listing.color       || '—' },
    { label: 'Владельцы', value: listing.owners_count|| listing.owners || '—' },
    { label: 'Состояние', value: listing.condition   || '—' },
  ].filter(s => s.value && s.value !== '—') : []

  const features = listing?.features
    ? (Array.isArray(listing.features) ? listing.features : listing.features.split(',').map(f=>f.trim()))
    : []

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav>
        <Link className="logo" href="/">Израил<span>.</span>ру</Link>
        <div className="nav-right">
          <div className="lang-switch">
            <button className={`lang-btn${lang==='ru'?' active':''}`} onClick={()=>switchLang('ru')}>РУ</button>
            <button className={`lang-btn${lang==='he'?' active':''}`} onClick={()=>switchLang('he')}>עב</button>
          </div>
          <button className="btn-fav-nav">♡ <span className="fav-count">0</span></button>
          <button className="btn-login">Войти</button>
          <button className="btn-post">+ Подать объявление</button>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="breadcrumb-wrap">
        <div className="breadcrumb">
          <Link href="/">Главная</Link>
          <span className="bc-sep">→</span>
          <Link href="/auto">Авто</Link>
          <span className="bc-sep">→</span>
          <span>{loading ? '...' : notFound ? 'Не найдено' : `${brand} ${model}`}</span>
        </div>
      </div>

      {/* NOT FOUND */}
      {notFound && (
        <div className="not-found">
          <div className="nf-icon">🔍</div>
          <h2 className="nf-title">Объявление не найдено</h2>
          <p className="nf-sub">Возможно, оно было удалено или ещё не одобрено</p>
          <Link href="/auto" className="btn-back">← Вернуться к авто</Link>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && !notFound && <Skeleton />}

      {/* CONTENT */}
      {!loading && !notFound && listing && (
        <>
          <div className="listing-wrap">
            <div className="listing-main">

              {/* GALLERY */}
              <Gallery icon={icon} />

              {/* TITLE ROW */}
              <div className="listing-title-row">
                <div>
                  <h1 className="listing-title">{listing.title}</h1>
                  <div className="listing-meta">
                    📍 {listing.city || '—'} · {timeAgo(listing.created_at)}
                    {listing.vip && <span className="vip-badge">⭐ VIP</span>}
                    {listing.views > 0 && <span className="views-badge">👁 {listing.views}</span>}
                  </div>
                </div>
                <button className={`btn-fav-lg${favd?' favd':''}`} onClick={()=>setFavd(!favd)}>
                  {favd ? '❤️' : '🤍'} {favd ? 'В избранном' : 'В избранное'}
                </button>
              </div>

              {/* DESCRIPTION */}
              {listing.description && (
                <div className="listing-section">
                  <h2 className="section-title">Описание</h2>
                  <p className="listing-desc">{listing.description}</p>
                </div>
              )}

              {/* SPECS */}
              {specs.length > 0 && (
                <div className="listing-section">
                  <h2 className="section-title">Характеристики</h2>
                  <div className="specs-grid">
                    {specs.map(s => (
                      <div key={s.label} className="spec-item">
                        <div className="spec-label">{s.label}</div>
                        <div className="spec-value">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FEATURES */}
              {features.length > 0 && (
                <div className="listing-section">
                  <h2 className="section-title">Комплектация</h2>
                  <div className="features-grid">
                    {features.map(f => (
                      <div key={f} className="feature-item">✓ {f}</div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* SIDEBAR */}
            <div className="listing-sidebar">
              <div className="price-card">
                <div className="price-main">{formatPrice(listing.price)}</div>
                {(km > 0 || year) && (
                  <div className="price-sub">
                    {km > 0 ? `${km.toLocaleString()} км` : ''}{km > 0 && year ? ' · ' : ''}{year ? `${year} г.` : ''}
                  </div>
                )}
                {phone && (
                  <>
                    <a href={`https://wa.me/${phone.replace(/\D/g,'')}`}
                       target="_blank" rel="noopener noreferrer"
                       className="btn-wa-main">💬 Написать в WhatsApp</a>
                    <a href={`tel:${phone}`} className="btn-call">📞 {phone}</a>
                  </>
                )}
              </div>

              <div className="seller-card">
                <div className="seller-header">
                  <div className="seller-avatar">{sellerName[0]?.toUpperCase() || '?'}</div>
                  <div>
                    <div className="seller-name">{sellerName}</div>
                    <div className="seller-type">{listing.seller_type === 'dealer' ? 'Дилер' : 'Частник'}</div>
                  </div>
                </div>
                <div className="safety-tip">
                  🛡️ Всегда встречайтесь в публичном месте и проверяйте документы перед передачей денег
                </div>
              </div>

              <div className="share-card">
                <div className="share-title">Поделиться</div>
                <div className="share-btns">
                  <a href={`https://wa.me/?text=${encodeURIComponent(listing.title + ' ' + formatPrice(listing.price))}`}
                     target="_blank" rel="noopener noreferrer"
                     className="share-btn">💬 WhatsApp</a>
                  <button className="share-btn" onClick={()=>navigator.clipboard?.writeText(window.location.href)}>
                    📋 Скопировать ссылку
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIMILAR */}
          {similar.length > 0 && (
            <div className="similar-section">
              <div className="similar-inner">
                <h2 className="section-title" style={{marginBottom:'20px'}}>Похожие объявления</h2>
                <div className="similar-grid">
                  {similar.map(item => (
                    <Link key={item.id} href={`/auto/${item.id}`} className="similar-card">
                      <div className="similar-img">{item.icon || '🚗'}</div>
                      <div className="similar-body">
                        <div className="similar-price">{formatPrice(item.price)}</div>
                        <div className="similar-title">{item.title}</div>
                        <div className="similar-loc">📍 {item.city || '—'} · {timeAgo(item.created_at)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <footer>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Израил.ру</div>
          <div className="footer-legal">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Пользовательское соглашение</a>
          </div>
        </div>
      </footer>
    </>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
:root{--cream:#F8F6F0;--cream2:#F0EDE4;--cream3:#E6E1D4;--navy:#1B2D6B;--navy-mid:#2C45A0;--navy-lt:#4A6FD4;--navy-dim:rgba(27,45,107,0.07);--gold:#B8892A;--text:#1A1A2E;--muted:#8A8AA8;--border:rgba(27,45,107,0.1);--radius:16px;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:var(--cream);color:var(--text);}
nav{position:sticky;top:0;z-index:200;height:68px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(248,246,240,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.logo{font-family:'Playfair Display',serif;font-weight:900;font-size:23px;color:var(--navy);text-decoration:none;letter-spacing:-0.3px;}
.logo span{color:var(--navy-mid);}
.nav-right{display:flex;align-items:center;gap:8px;}
.lang-switch{display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;}
.lang-btn{background:transparent;border:none;padding:6px 12px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;}
.lang-btn.active{background:var(--navy);color:white;}
.btn-fav-nav{display:flex;align-items:center;gap:5px;background:transparent;border:1.5px solid var(--border);border-radius:10px;padding:9px 14px;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;color:var(--text);}
.fav-count{font-size:12px;font-weight:700;color:var(--muted);}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}
.btn-post{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 22px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}
.breadcrumb-wrap{background:white;border-bottom:1px solid var(--border);}
.breadcrumb{max-width:1200px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:8px;font-size:13px;}
.breadcrumb a{color:var(--muted);text-decoration:none;}
.breadcrumb a:hover{color:var(--navy);}
.breadcrumb span{color:var(--text);font-weight:600;}
.bc-sep{color:var(--muted);}
.listing-wrap{max-width:1200px;margin:0 auto;padding:32px 32px 64px;display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:start;}
.gallery{margin-bottom:28px;}
.gallery-main{position:relative;background:linear-gradient(135deg,var(--cream2),var(--cream3));border-radius:var(--radius);height:380px;display:flex;align-items:center;justify-content:center;font-size:120px;overflow:hidden;border:1.5px solid var(--border);}
.gallery-main-img{font-size:120px;}
.gallery-nav{position:absolute;top:50%;transform:translateY(-50%);background:white;border:1.5px solid var(--border);width:44px;height:44px;border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 2px 12px rgba(0,0,0,0.1);}
.gallery-nav:hover{background:var(--navy);color:white;border-color:var(--navy);}
.gallery-prev{left:16px;}.gallery-next{right:16px;}
.gallery-counter{position:absolute;bottom:16px;right:16px;background:rgba(0,0,0,0.5);color:white;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;}
.gallery-thumbs{display:flex;gap:8px;margin-top:10px;}
.gallery-thumb{flex:1;height:72px;background:linear-gradient(135deg,var(--cream2),var(--cream3));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;border:2px solid transparent;transition:all .2s;}
.gallery-thumb.active{border-color:var(--navy);}
.listing-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:28px;}
.listing-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:var(--navy);letter-spacing:-0.5px;margin-bottom:8px;}
.listing-meta{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vip-badge{background:var(--gold);color:white;font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;}
.views-badge{background:var(--navy-dim);color:var(--navy-mid);font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;}
.btn-fav-lg{display:flex;align-items:center;gap:8px;background:white;border:1.5px solid var(--border);border-radius:11px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}
.btn-fav-lg:hover{border-color:var(--navy);}
.btn-fav-lg.favd{border-color:#ef4444;background:#fff5f5;color:#ef4444;}
.listing-section{margin-bottom:32px;}
.section-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border);}
.listing-desc{font-size:14px;line-height:1.75;color:var(--text);}
.specs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-radius:12px;overflow:hidden;border:1px solid var(--border);}
.spec-item{background:white;padding:14px 16px;}
.spec-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;}
.spec-value{font-size:14px;font-weight:600;color:var(--text);}
.features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
.feature-item{background:white;border:1.5px solid var(--border);border-radius:9px;padding:10px 14px;font-size:13px;font-weight:500;}
.listing-sidebar{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
.price-card{background:white;border:1.5px solid var(--border);border-radius:20px;padding:24px;box-shadow:0 4px 24px rgba(27,45,107,0.08);}
.price-main{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:var(--navy);letter-spacing:-1px;margin-bottom:4px;direction:ltr;unicode-bidi:embed;}
.price-sub{font-size:13px;color:var(--muted);margin-bottom:20px;direction:ltr;unicode-bidi:embed;}
.btn-wa-main{display:flex;align-items:center;justify-content:center;gap:8px;background:#22C55E;color:white;text-decoration:none;border-radius:12px;padding:14px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:10px;transition:opacity .2s;}
.btn-wa-main:hover{opacity:.88;}
.btn-call{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--navy-dim);color:var(--navy);text-decoration:none;border-radius:12px;padding:13px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;border:1.5px solid var(--border);transition:all .2s;direction:ltr;unicode-bidi:embed;}
.btn-call:hover{background:var(--navy);color:white;}
.seller-card{background:white;border:1.5px solid var(--border);border-radius:20px;padding:20px;}
.seller-header{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.seller-avatar{width:44px;height:44px;border-radius:50%;background:var(--navy);color:white;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;flex-shrink:0;}
.seller-name{font-size:15px;font-weight:700;color:var(--text);}
.seller-type{font-size:12px;color:var(--muted);margin-top:2px;}
.safety-tip{background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:10px;padding:10px 12px;font-size:12px;color:#92400e;line-height:1.5;}
.share-card{background:white;border:1.5px solid var(--border);border-radius:16px;padding:16px;}
.share-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px;}
.share-btns{display:flex;flex-direction:column;gap:8px;}
.share-btn{background:var(--cream);border:1.5px solid var(--border);border-radius:9px;padding:9px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .2s;text-decoration:none;text-align:center;display:block;}
.share-btn:hover{border-color:var(--navy);color:var(--navy);}
.similar-section{background:white;border-top:1px solid var(--border);}
.similar-inner{max-width:1200px;margin:0 auto;padding:40px 32px;}
.similar-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.similar-card{background:var(--cream);border:1.5px solid var(--border);border-radius:var(--radius);overflow:hidden;text-decoration:none;transition:all .25s;display:block;}
.similar-card:hover{border-color:var(--navy-lt);transform:translateY(-3px);box-shadow:0 12px 32px rgba(27,45,107,0.1);}
.similar-img{height:120px;background:linear-gradient(135deg,var(--cream2),var(--cream3));display:flex;align-items:center;justify-content:center;font-size:44px;}
.similar-body{padding:12px 14px;}
.similar-price{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--navy);margin-bottom:4px;direction:ltr;unicode-bidi:embed;}
.similar-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.similar-loc{font-size:11px;color:var(--muted);}
.not-found{text-align:center;padding:80px 20px;}
.nf-icon{font-size:56px;margin-bottom:16px;}
.nf-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--navy);margin-bottom:8px;}
.nf-sub{font-size:14px;color:var(--muted);margin-bottom:24px;}
.btn-back{display:inline-block;background:var(--navy);color:white;text-decoration:none;border-radius:12px;padding:12px 28px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;}

/* Скелетон */
.sk-gallery{height:380px;border-radius:var(--radius);background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;margin-bottom:28px;}
.sk-line{height:14px;border-radius:6px;background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;margin-bottom:14px;}
.sk-title-line{height:32px;width:70%;}
.sk-meta-line{width:50%;}
.sk-desc-line{width:95%;}
.sk-price-card{height:280px;border-radius:20px;background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

footer{background:var(--navy);}
.footer-bottom{max-width:1200px;margin:0 auto;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:rgba(255,255,255,0.3);}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;}
@media(max-width:900px){.listing-wrap{grid-template-columns:1fr;padding:20px 16px 40px}.listing-sidebar{position:static}.specs-grid{grid-template-columns:repeat(2,1fr)}.similar-grid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){nav{padding:0 16px}.specs-grid{grid-template-columns:1fr 1fr}.features-grid{grid-template-columns:1fr}.similar-grid{grid-template-columns:1fr}}
`
