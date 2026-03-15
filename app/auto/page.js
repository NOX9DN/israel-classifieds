'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/lib/useLang'
import { supabase } from '@/app/supabase'
import Link from 'next/link'

// ─── СПРАВОЧНИКИ (остаются статичными) ──────────────────────────────────────
const BRANDS  = ['Все марки','Toyota','Hyundai','BMW','Tesla','Kia','Mazda','Mercedes','Honda','VW','Skoda','Nissan','Porsche','Audi','Lexus','Subaru','Mitsubishi','Ford','Renault','Peugeot']
const MODELS  = {
  'Все марки': ['Любая модель'],
  Toyota:   ['Любая модель','Camry','Corolla','RAV4','Land Cruiser','Prius','Yaris','Highlander','Avalon'],
  Hyundai:  ['Любая модель','Tucson','Santa Fe','i30','i20','Elantra','Sonata','Kona','Ioniq'],
  BMW:      ['Любая модель','3 Series','5 Series','7 Series','X3','X5','X6','M3','M5','i4','iX'],
  Tesla:    ['Любая модель','Model 3','Model Y','Model S','Model X','Cybertruck'],
  Kia:      ['Любая модель','Sportage','Sorento','Cerato','Rio','Stinger','EV6','Niro'],
  Mazda:    ['Любая модель','CX-5','CX-3','Mazda 3','Mazda 6','MX-5','CX-30'],
  Mercedes: ['Любая модель','C-Class','E-Class','S-Class','GLC','GLE','A-Class','CLA','AMG GT'],
  Honda:    ['Любая модель','Civic','Accord','CR-V','HR-V','Jazz','Pilot'],
  VW:       ['Любая модель','Golf','Polo','Tiguan','Passat','Arteon','T-Roc','ID.4'],
  Skoda:    ['Любая модель','Octavia','Superb','Kodiaq','Karoq','Fabia','Scala'],
  Nissan:   ['Любая модель','Qashqai','X-Trail','Micra','Leaf','GT-R','Navara'],
  Porsche:  ['Любая модель','Cayenne','Macan','911','Panamera','Taycan','Boxster'],
  Audi:     ['Любая модель','A3','A4','A6','Q3','Q5','Q7','TT','e-tron','RS6'],
  Lexus:    ['Любая модель','RX','NX','IS','ES','GX','LX','UX'],
  Subaru:   ['Любая модель','Forester','Outback','Impreza','XV','Legacy','BRZ'],
  Mitsubishi:['Любая модель','Outlander','ASX','Eclipse Cross','L200','Pajero'],
  Ford:     ['Любая модель','Focus','Fiesta','Kuga','Mustang','Explorer','Ranger','Puma'],
  Renault:  ['Любая модель','Clio','Megane','Captur','Kadjar','Koleos','Zoe'],
  Peugeot:  ['Любая модель','208','308','508','2008','3008','5008','e-208'],
}
const YEARS   = ['Любой','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2014','2012','2010']
const CITIES  = { all:'Весь Израиль', 'Тель-Авив':'Тель-Авив', 'Хайфа':'Хайфа', 'Иерусалим':'Иерусалим', 'Нетания':'Нетания', 'Ришон ле-Цион':'Ришон ле-Цион', 'Беэр-Шева':'Беэр-Шева', 'Ашдод':'Ашдод' }
const FUELS   = [{ val:'all',label:'Любое' },{ val:'petrol',label:'Бензин' },{ val:'diesel',label:'Дизель' },{ val:'hybrid',label:'Гибрид' },{ val:'electric',label:'Электро' }]
const TRANS   = [{ val:'all',label:'Любая КПП' },{ val:'auto',label:'Автомат' },{ val:'manual',label:'Механика' }]
const BODIES  = [{ val:'all',label:'Любой кузов' },{ val:'sedan',label:'Седан' },{ val:'suv',label:'Внедорожник' },{ val:'hatch',label:'Хэтчбек' },{ val:'coupe',label:'Купе' },{ val:'van',label:'Минивэн' }]
const DRIVES  = [{ val:'all',label:'Любой привод' },{ val:'fwd',label:'Передний' },{ val:'rwd',label:'Задний' },{ val:'awd',label:'Полный' }]
const SELLERS = [{ val:'all',label:'Любой' },{ val:'private',label:'Частник' },{ val:'dealer',label:'Дилер' }]
const OWNERS  = [{ val:'all',label:'Любое' },{ val:'1',label:'Один' },{ val:'2',label:'До двух' },{ val:'3',label:'До трёх' }]

// ─── ХЕЛПЕРЫ ────────────────────────────────────────────────────────────────
function formatPrice(n) {
  if (!n) return '—'
  return '₪ ' + Number(n).toLocaleString('ru-RU')
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 86400)   return 'Сегодня'
  if (diff < 172800)  return 'Вчера'
  const days = Math.floor(diff / 86400)
  return `${days} дн.`
}

// ─── КАРТОЧКА ────────────────────────────────────────────────────────────────
function Card({ item }) {
  const [fav, setFav] = useState(false)
  const fuelLabel  = { petrol:'Бензин', diesel:'Дизель', hybrid:'Гибрид', electric:'Электро' }
  const transLabel = { auto:'Автомат', manual:'Механика' }

  // Данные из Supabase (поля могут быть в snake_case)
  const fuel  = item.fuel  || item.fuel_type
  const trans = item.trans || item.transmission
  const kmN   = item.kmN   || item.mileage || 0
  const hp    = item.hp    || item.horsepower || 0
  const city  = item.city  || '—'
  const icon  = item.icon  || '🚗'

  return (
    <Link href={`/auto/${item.id}`} className="card-link">
      <div className="card">
        <div className="card-img">
          <span>{icon}</span>
          {item.vip && <div className="badge-vip">⭐ VIP</div>}
          <button className="btn-fav" onClick={e=>{e.preventDefault();setFav(!fav)}}>{fav?'❤️':'🤍'}</button>
        </div>
        <div className="card-body">
          <div className="card-price">{formatPrice(item.price)}</div>
          <div className="card-title">{item.title}</div>
          <div className="card-tags">
            {fuel  && <span className="tag">{fuelLabel[fuel]  || fuel}</span>}
            {trans && <span className="tag">{transLabel[trans] || trans}</span>}
            {kmN>0 && <span className="tag">{kmN.toLocaleString()} км</span>}
            {hp>0  && <span className="tag">{hp} л.с.</span>}
          </div>
          <div className="card-footer">
            <span className="card-loc">📍 {city} · {timeAgo(item.created_at)}</span>
            <button className="wa-btn" onClick={e=>{
               e.preventDefault()
               e.stopPropagation()
               window.open(`https://wa.me/${(item.phone||'').replace(/\D/g,'')}`, '_blank')
               }}>💬 WA</button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── СКЕЛЕТОН (пока грузится) ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="sk-img"/>
      <div className="card-body">
        <div className="sk-line sk-price"/>
        <div className="sk-line sk-title"/>
        <div className="sk-tags">
          <div className="sk-tag"/><div className="sk-tag"/><div className="sk-tag"/>
        </div>
        <div className="sk-line sk-footer"/>
      </div>
    </div>
  )
}

// ─── СТРАНИЦА ─────────────────────────────────────────────────────────────
export default function AutoPage() {
  const { lang, switchLang } = useLang()

  // Данные
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(0)
  const PAGE_SIZE = 15

  // Фильтры — основные
  const [brand,    setBrand]    = useState('Все марки')
  const [model,    setModel]    = useState('Любая модель')
  const [yearFrom, setYearFrom] = useState('Любой')
  const [yearTo,   setYearTo]   = useState('Любой')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [city,     setCity]     = useState('all')
  const [fuel,     setFuel]     = useState('all')
  const [trans,    setTrans]    = useState('all')

  // Фильтры — расширенные
  const [body,      setBody]      = useState('all')
  const [drive,     setDrive]     = useState('all')
  const [hpMin,     setHpMin]     = useState('')
  const [hpMax,     setHpMax]     = useState('')
  const [kmMax,     setKmMax]     = useState('')
  const [owners,    setOwners]    = useState('all')
  const [seller,    setSeller]    = useState('all')
  const [withPhoto, setWithPhoto] = useState(false)

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [advOpen,     setAdvOpen]     = useState(false)
  const [sort,        setSort]        = useState('new')

  // ─── ЗАГРУЗКА ИЗ SUPABASE ──────────────────────────────────────────────
  useEffect(() => {
    fetchListings(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, model, yearFrom, yearTo, priceMin, priceMax, city, fuel, trans,
      body, drive, hpMin, hpMax, kmMax, owners, seller, withPhoto, sort])

  async function fetchListings(pageNum = 0) {
    setLoading(true)
    try {
      let q = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('category', 'auto')
        .eq('status', 'active')

      // Фильтры
      if (brand !== 'Все марки')    q = q.ilike('title', `%${brand}%`)
      if (city  !== 'all')          q = q.eq('city', city)
      if (fuel  !== 'all')          q = q.eq('fuel_type', fuel)
      if (trans !== 'all')          q = q.eq('transmission', trans)
      if (body  !== 'all')          q = q.eq('body_type', body)
      if (drive !== 'all')          q = q.eq('drive_type', drive)
      if (seller !== 'all')         q = q.eq('seller_type', seller)
      if (yearFrom !== 'Любой')     q = q.gte('year', parseInt(yearFrom))
      if (yearTo   !== 'Любой')     q = q.lte('year', parseInt(yearTo))
      if (priceMin)                 q = q.gte('price', parseInt(priceMin))
      if (priceMax)                 q = q.lte('price', parseInt(priceMax))
      if (hpMin)                    q = q.gte('horsepower', parseInt(hpMin))
      if (hpMax)                    q = q.lte('horsepower', parseInt(hpMax))
      if (kmMax)                    q = q.lte('mileage', parseInt(kmMax))
      if (owners !== 'all')         q = q.lte('owners_count', parseInt(owners))

      // Сортировка — VIP всегда первые
      if (sort === 'cheap')     q = q.order('vip', { ascending: false }).order('price', { ascending: true })
      else if (sort === 'expensive') q = q.order('vip', { ascending: false }).order('price', { ascending: false })
      else if (sort === 'hp')   q = q.order('vip', { ascending: false }).order('horsepower', { ascending: false })
      else if (sort === 'km')   q = q.order('vip', { ascending: false }).order('mileage', { ascending: true })
      else                      q = q.order('vip', { ascending: false }).order('created_at', { ascending: false })

      // Пагинация
      const from = pageNum * PAGE_SIZE
      q = q.range(from, from + PAGE_SIZE - 1)

      const { data, error, count } = await q

      if (error) throw error

      if (pageNum === 0) {
        setListings(data || [])
      } else {
        setListings(prev => [...prev, ...(data || [])])
      }
      setTotal(count || 0)
      setPage(pageNum)
    } catch (err) {
      console.error('Supabase error:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetAll() {
    setBrand('Все марки'); setModel('Любая модель'); setYearFrom('Любой'); setYearTo('Любой')
    setPriceMin(''); setPriceMax(''); setCity('all'); setFuel('all'); setTrans('all')
    setBody('all'); setDrive('all'); setHpMin(''); setHpMax('')
    setKmMax(''); setOwners('all'); setSeller('all'); setWithPhoto(false)
  }

  const basicActive = [brand!=='Все марки',model!=='Любая модель',yearFrom!=='Любой',yearTo!=='Любой',priceMin,priceMax,city!=='all',fuel!=='all',trans!=='all'].filter(Boolean).length
  const advActive   = [body!=='all',drive!=='all',hpMin,hpMax,kmMax,owners!=='all',seller!=='all',withPhoto].filter(Boolean).length
  const totalActive = basicActive + advActive
  const hasMore     = listings.length < total

  return (
    <>
      <style>{CSS}</style>

      <nav>
        <Link className="logo" href="/">Израил<span>.</span>ру</Link>
        <div className="nav-right">
          <div className="lang-switch">
            <button className={`lang-btn${lang==='ru'?' active':''}`} onClick={()=>switchLang('ru')}>РУ</button>
            <button className={`lang-btn${lang==='he'?' active':''}`} onClick={()=>switchLang('he')}>עב</button>
          </div>
          <button className="btn-fav-nav" title="Избранное">🤍 <span className="fav-count">0</span></button>
          <button className="btn-login">Войти</button>
          <button className="btn-post">+ Подать объявление</button>
        </div>
      </nav>

      <div className="breadcrumb-wrap">
        <div className="breadcrumb">
          <Link href="/">Главная</Link>
          <span className="bc-sep">→</span>
          <span>Авто</span>
        </div>
      </div>

      <div className="cat-banner">
        <div className="cat-banner-inner">
          <div className="cat-banner-left">
            <h1 className="cat-banner-title">Твой следующий автомобиль<br/><em>уже ждёт тебя</em></h1>
            <p className="cat-banner-sub">Частники и дилеры · Весь Израиль · Без посредников</p>
            <div className="cat-stats">
              <div className="cat-stat"><div className="cat-stat-n">{total}+</div><div className="cat-stat-l">Авто</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">20+</div><div className="cat-stat-l">Марок</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">8</div><div className="cat-stat-l">Городов</div></div>
            </div>
          </div>
        </div>
        <div className="banner-filter-bar">
          <button className={`filter-toggle${filtersOpen?' active':''}`} onClick={()=>setFiltersOpen(!filtersOpen)}>
            ⚙️ Фильтры {totalActive>0 && <span className="filter-badge">{totalActive}</span>}
          </button>
        </div>
      </div>

      <div className={`filters-panel${filtersOpen?' open':''}`}>
        <div className="filters-inner">
          {/* МАРКА + МОДЕЛЬ */}
          <div className="filter-row filter-row-top">
            <div className="f-block f-block-lg">
              <label className="f-label">Марка</label>
              <select className="f-sel f-sel-lg" value={brand} onChange={e=>{setBrand(e.target.value);setModel('Любая модель')}}>
                {BRANDS.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="f-block f-block-lg">
              <label className="f-label">Модель</label>
              <select className="f-sel f-sel-lg" value={model} onChange={e=>setModel(e.target.value)}>
                {(MODELS[brand]||['Любая модель']).map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="f-block"><label className="f-label">Топливо</label><select className="f-sel" value={fuel} onChange={e=>setFuel(e.target.value)}>{FUELS.map(f=><option key={f.val} value={f.val}>{f.label}</option>)}</select></div>
            <div className="f-block"><label className="f-label">КПП</label><select className="f-sel" value={trans} onChange={e=>setTrans(e.target.value)}>{TRANS.map(tr=><option key={tr.val} value={tr.val}>{tr.label}</option>)}</select></div>
            <div className="f-block"><label className="f-label">Город</label>
              <select className="f-sel" value={city} onChange={e=>setCity(e.target.value)}>
                {Object.entries(CITIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* ГОД + ЦЕНА */}
          <div className="filter-row">
            <div className="f-block"><label className="f-label">Год от</label><select className="f-sel" value={yearFrom} onChange={e=>setYearFrom(e.target.value)}>{YEARS.map(y=><option key={y}>{y}</option>)}</select></div>
            <div className="f-block"><label className="f-label">Год до</label><select className="f-sel" value={yearTo} onChange={e=>setYearTo(e.target.value)}>{YEARS.map(y=><option key={y}>{y}</option>)}</select></div>
            <div className="f-block"><label className="f-label">Цена от (₪)</label><input className="f-input" type="number" placeholder="0" value={priceMin} onChange={e=>setPriceMin(e.target.value)}/></div>
            <div className="f-block"><label className="f-label">Цена до (₪)</label><input className="f-input" type="number" placeholder="∞" value={priceMax} onChange={e=>setPriceMax(e.target.value)}/></div>
          </div>

          <button className={`adv-toggle${advOpen?' open':''}`} onClick={()=>setAdvOpen(!advOpen)}>
            {advOpen ? '▲ Скрыть расширенный поиск' : '▼ Расширенный поиск'}
            {advActive>0 && <span className="filter-badge" style={{marginLeft:8}}>{advActive}</span>}
          </button>

          {advOpen && (
            <div className="filter-row adv-row">
              <div className="f-block"><label className="f-label">Тип кузова</label><select className="f-sel" value={body} onChange={e=>setBody(e.target.value)}>{BODIES.map(b=><option key={b.val} value={b.val}>{b.label}</option>)}</select></div>
              <div className="f-block"><label className="f-label">Привод</label><select className="f-sel" value={drive} onChange={e=>setDrive(e.target.value)}>{DRIVES.map(d=><option key={d.val} value={d.val}>{d.label}</option>)}</select></div>
              <div className="f-block"><label className="f-label">Мощность от (л.с.)</label><input className="f-input" type="number" placeholder="0" value={hpMin} onChange={e=>setHpMin(e.target.value)}/></div>
              <div className="f-block"><label className="f-label">Мощность до (л.с.)</label><input className="f-input" type="number" placeholder="∞" value={hpMax} onChange={e=>setHpMax(e.target.value)}/></div>
              <div className="f-block"><label className="f-label">Пробег до (км)</label><input className="f-input" type="number" placeholder="∞" value={kmMax} onChange={e=>setKmMax(e.target.value)}/></div>
              <div className="f-block"><label className="f-label">Владельцы</label><select className="f-sel" value={owners} onChange={e=>setOwners(e.target.value)}>{OWNERS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}</select></div>
              <div className="f-block"><label className="f-label">Продавец</label><select className="f-sel" value={seller} onChange={e=>setSeller(e.target.value)}>{SELLERS.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}</select></div>
              <div className="f-block f-check-block"><label className="f-label">Опции</label><label className="f-check"><input type="checkbox" checked={withPhoto} onChange={e=>setWithPhoto(e.target.checked)}/><span>Только с фото</span></label></div>
            </div>
          )}

          <div className="filter-actions">
            <button className="btn-reset" onClick={resetAll}>✕ Сбросить всё</button>
            <div className="results-count">{loading ? 'Загрузка...' : `${total} результатов`}</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="cards-hd">
          <div className="cards-label">
            {loading ? 'Загрузка...' : listings.length > 0 ? `Найдено: ${total}` : 'Ничего не найдено'}
          </div>
          <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="new">Новые сначала</option>
            <option value="cheap">Дешевле</option>
            <option value="expensive">Дороже</option>
            <option value="hp">Мощнее</option>
            <option value="km">Меньше пробег</option>
          </select>
        </div>

        {loading && listings.length === 0 ? (
          <div className="cards-grid">
            {Array(6).fill(0).map((_,i)=><SkeletonCard key={i}/>)}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="cards-grid">
              {listings.map((item,i)=>(
                <div key={item.id} style={{animationDelay:`${i*0.05}s`}}>
                  <Card item={item}/>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="load-more-wrap">
                <button className="load-more" onClick={()=>fetchListings(page+1)} disabled={loading}>
                  {loading ? 'Загрузка...' : 'Показать ещё'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Ничего не найдено</div>
            <div className="empty-sub">Попробуйте изменить фильтры</div>
            <button className="btn-reset-lg" onClick={resetAll}>Сбросить фильтры</button>
          </div>
        )}
      </div>

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
.btn-post{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 22px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.btn-login:hover{border-color:var(--navy);background:var(--navy-dim);}
.btn-fav-nav{display:flex;align-items:center;gap:5px;background:transparent;border:1.5px solid var(--border);border-radius:10px;padding:9px 14px;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;color:var(--text);}
.btn-fav-nav:hover{border-color:var(--navy);background:var(--navy-dim);}
.fav-count{font-size:12px;font-weight:700;color:var(--muted);}
.breadcrumb-wrap{background:white;border-bottom:1px solid var(--border);}
.breadcrumb{max-width:1100px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:8px;font-size:13px;}
.breadcrumb a{color:var(--muted);text-decoration:none;}
.breadcrumb a:hover{color:var(--navy);}
.breadcrumb span{color:var(--text);font-weight:600;}
.bc-sep{color:var(--muted);}
.cat-banner{background:linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #3558C0 100%);overflow:hidden;position:relative;}
.cat-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 75% 50%, rgba(74,111,212,0.25) 0%, transparent 65%);}
.cat-banner-inner{max-width:1100px;margin:0 auto;padding:36px 32px 28px;display:flex;align-items:center;justify-content:space-between;gap:24px;position:relative;z-index:1;}
.cat-banner-left{flex:1;min-width:0;}
.cat-banner-title{font-family:'Playfair Display',serif;font-size:clamp(20px,2.8vw,34px);font-weight:900;color:white;letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;}
.cat-banner-title em{font-style:italic;color:#93C5FD;}
.cat-banner-sub{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5;margin-bottom:22px;letter-spacing:0.2px;}
.cat-stats{display:flex;align-items:center;gap:20px;}
.cat-stat{text-align:left;}
.cat-stat-n{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:white;line-height:1;direction:ltr;unicode-bidi:embed;}
.cat-stat-l{font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;text-transform:uppercase;letter-spacing:0.5px;}
.cat-stat-div{width:1px;height:28px;background:rgba(255,255,255,0.15);}
.banner-filter-bar{max-width:1100px;margin:0 auto;padding:0 32px 20px;position:relative;z-index:1;}
.filter-toggle{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,255,255,0.18);border-radius:11px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:white;cursor:pointer;transition:all .2s;}
.filter-toggle:hover,.filter-toggle.active{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.35);}
.filter-badge{background:white;color:var(--navy);font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;}
.filters-panel{background:white;border-bottom:1px solid var(--border);max-height:0;overflow:hidden;transition:max-height .4s ease;}
.filters-panel.open{max-height:900px;}
.filters-inner{max-width:1100px;margin:0 auto;padding:24px 32px 20px;}
.filter-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;}
.filter-row-top{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.f-block{display:flex;flex-direction:column;gap:5px;min-width:130px;flex:1;}
.f-block-lg{min-width:200px;flex:2;}
.f-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;}
.f-sel,.f-input,.f-sel-lg{background:var(--cream);border:1.5px solid var(--border);border-radius:9px;padding:9px 12px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);outline:none;transition:border-color .2s;width:100%;}
.f-sel:focus,.f-input:focus,.f-sel-lg:focus{border-color:var(--navy-lt);background:white;}
.f-sel option,.f-sel-lg option{background:white;}
.f-sel-lg{padding:11px 14px;font-size:14px;font-weight:600;color:var(--navy);}
.f-check-block{justify-content:flex-end;}
.f-check{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--text);font-weight:500;padding:9px 0;}
.f-check input{width:16px;height:16px;accent-color:var(--navy);cursor:pointer;}
.adv-toggle{background:transparent;border:none;padding:8px 0;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--navy-mid);cursor:pointer;display:flex;align-items:center;gap:4px;margin-bottom:4px;}
.adv-toggle:hover{color:var(--navy);}
.filter-actions{display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--border);}
.btn-reset{background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 18px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .2s;}
.btn-reset:hover{border-color:var(--navy);color:var(--navy);}
.results-count{font-size:13px;font-weight:600;color:var(--navy);}
.main{max-width:1100px;margin:0 auto;padding:0 32px;}
.cards-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-top:32px;}
.cards-label{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);}
.sort-sel{background:white;border:1.5px solid var(--border);border-radius:8px;padding:8px 13px;font-family:'Inter',sans-serif;font-size:12px;color:var(--text);outline:none;cursor:pointer;}
.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:64px;}
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
.wa-btn{background:#22C55E;color:white;border:none;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;cursor:pointer;}
.empty-state{text-align:center;padding:80px 20px;}
.empty-icon{font-size:48px;margin-bottom:16px;}
.empty-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty-sub{font-size:14px;color:var(--muted);margin-bottom:24px;}
.btn-reset-lg{background:var(--navy);color:white;border:none;border-radius:12px;padding:12px 32px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}
.load-more-wrap{text-align:center;padding-bottom:64px;}
.load-more{background:transparent;border:1.5px solid var(--border);border-radius:12px;padding:13px 44px;color:var(--muted);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.load-more:hover{border-color:var(--navy);color:var(--navy);}
.load-more:disabled{opacity:0.5;cursor:default;}
footer{background:var(--navy);}
.footer-bottom{max-width:1100px;margin:0 auto;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:rgba(255,255,255,0.3);}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;}
.footer-legal a:hover{color:rgba(255,255,255,0.7);}

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
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:900px){.cards-grid{grid-template-columns:1fr 1fr}.f-block{min-width:120px}}
@media(max-width:640px){.cards-grid{grid-template-columns:1fr}nav{padding:0 16px}.main{padding:0 16px}.filters-inner{padding:16px}.cat-banner-inner{padding:24px 16px 16px}.banner-filter-bar{padding:0 16px 16px}}
`
