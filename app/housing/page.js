'use client'

import { useState } from 'react'
import { useLang } from '@/lib/useLang'
import Link from 'next/link'

// ─── DATA ──────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1,  icon:'🏠', vip:true,  price:7200,  priceStr:'₪ 7 200 / мес', title:'3 комнаты, ул. Дизенгоф',        type:'rent',  rooms:3, area:75,  floor:4,  floors:8,  city:'tlv',   district:'Центр',      condition:'good',    seller:'owner',  withPhoto:true,  time:'Сегодня' },
  { id:2,  icon:'🏡', vip:false, price:4800,  priceStr:'₪ 4 800 / мес', title:'Студия, центр Хайфы',             type:'rent',  rooms:1, area:38,  floor:2,  floors:5,  city:'haifa', district:'Центр',      condition:'good',    seller:'agent',  withPhoto:true,  time:'Вчера'   },
  { id:3,  icon:'🏢', vip:true,  price:9500,  priceStr:'₪ 9 500 / мес', title:'4 комнаты, Рамат-Ган',            type:'rent',  rooms:4, area:110, floor:7,  floors:12, city:'ramat', district:'Север',      condition:'new',     seller:'owner',  withPhoto:true,  time:'2 дня'   },
  { id:4,  icon:'🏠', vip:false, price:1850000,priceStr:'₪ 1 850 000',  title:'5 комнат, пентхаус, Герцлия',     type:'sale',  rooms:5, area:180, floor:12, floors:12, city:'her',   district:'Питуах',     condition:'new',     seller:'owner',  withPhoto:true,  time:'Сегодня' },
  { id:5,  icon:'🏡', vip:false, price:6200,  priceStr:'₪ 6 200 / мес', title:'2 комнаты + парковка, Нетания',   type:'rent',  rooms:2, area:58,  floor:3,  floors:6,  city:'net',   district:'Центр',      condition:'good',    seller:'agent',  withPhoto:false, time:'3 дня'   },
  { id:6,  icon:'🏢', vip:true,  price:1250000,priceStr:'₪ 1 250 000',  title:'3 комнаты, новый дом, Ришон',     type:'sale',  rooms:3, area:85,  floor:5,  floors:10, city:'rishon',district:'Восток',     condition:'new',     seller:'owner',  withPhoto:true,  time:'Сегодня' },
  { id:7,  icon:'🏠', vip:false, price:5500,  priceStr:'₪ 5 500 / мес', title:'3 комнаты, тихий район',          type:'rent',  rooms:3, area:72,  floor:1,  floors:3,  city:'beer',  district:'Центр',      condition:'good',    seller:'owner',  withPhoto:true,  time:'Вчера'   },
  { id:8,  icon:'🏡', vip:false, price:890000, priceStr:'₪ 890 000',    title:'2 комнаты, Бат-Ям у моря',        type:'sale',  rooms:2, area:55,  floor:6,  floors:8,  city:'bat',   district:'Юг',         condition:'good',    seller:'agent',  withPhoto:true,  time:'4 дня'   },
  { id:9,  icon:'🏢', vip:false, price:11000, priceStr:'₪ 11 000 / мес',title:'Вилла, 6 комнат, Кесария',        type:'rent',  rooms:6, area:250, floor:1,  floors:2,  city:'ces',   district:'Север',      condition:'new',     seller:'owner',  withPhoto:true,  time:'2 дня'   },
  { id:10, icon:'🏠', vip:true,  price:2100000,priceStr:'₪ 2 100 000',  title:'4 комнаты, Тель-Авив, башня',     type:'sale',  rooms:4, area:130, floor:18, floors:25, city:'tlv',   district:'Центр',      condition:'new',     seller:'owner',  withPhoto:true,  time:'Сегодня' },
  { id:11, icon:'🏡', vip:false, price:3900,  priceStr:'₪ 3 900 / мес', title:'1 комната, Петах-Тиква',          type:'rent',  rooms:1, area:32,  floor:2,  floors:4,  city:'petah', district:'Центр',      condition:'old',     seller:'owner',  withPhoto:false, time:'5 дней'  },
  { id:12, icon:'🏢', vip:false, price:680000, priceStr:'₪ 680 000',    title:'2 комнаты, Беэр-Шева',            type:'sale',  rooms:2, area:60,  floor:3,  floors:6,  city:'beer',  district:'Центр',      condition:'good',    seller:'agent',  withPhoto:true,  time:'3 дня'   },
]

const CITIES = { all:'Весь Израиль', tlv:'Тель-Авив', haifa:'Хайфа', jeru:'Иерусалим', net:'Нетания', rishon:'Ришон ле-Цион', beer:'Беэр-Шева', ashdod:'Ашдод', petah:'Петах-Тиква', ramat:'Рамат-Ган', bat:'Бат-Ям', her:'Герцлия', ces:'Кесария' }
const TYPES  = [{ val:'all',label:'Аренда и продажа' },{ val:'rent',label:'Аренда' },{ val:'sale',label:'Продажа' }]
const ROOMS  = [{ val:'all',label:'Любое кол-во' },{ val:'1',label:'1 комната' },{ val:'2',label:'2 комнаты' },{ val:'3',label:'3 комнаты' },{ val:'4',label:'4 комнаты' },{ val:'5',label:'5+ комнат' }]
const CONDITIONS = [{ val:'all',label:'Любое' },{ val:'new',label:'Новостройка' },{ val:'good',label:'Хорошее' },{ val:'old',label:'Требует ремонта' }]
const SELLERS = [{ val:'all',label:'Любой' },{ val:'owner',label:'Хозяин' },{ val:'agent',label:'Агентство' }]

// ─── CARD ──────────────────────────────────────────────────────────────────────
function Card({ item }) {
  const [fav, setFav] = useState(false)
  const typeLabel = { rent:'Аренда', sale:'Продажа' }
  const condLabel = { new:'Новостройка', good:'Хорошее', old:'Под ремонт' }
  return (
    <div className="card">
      <div className="card-img">
        <span>{item.icon}</span>
        {item.vip && <div className="badge-vip">⭐ VIP</div>}
        <div className={`badge-type ${item.type}`}>{typeLabel[item.type]}</div>
        <button className="btn-fav" onClick={()=>setFav(!fav)}>{fav?'❤️':'🤍'}</button>
      </div>
      <div className="card-body">
        <div className="card-price">{item.priceStr}</div>
        <div className="card-title">{item.title}</div>
        <div className="card-tags">
          <span className="tag">{item.rooms} комн.</span>
          <span className="tag">{item.area} м²</span>
          <span className="tag">{item.floor}/{item.floors} эт.</span>
          <span className="tag">{condLabel[item.condition]}</span>
        </div>
        <div className="card-footer">
          <span className="card-loc">📍 {CITIES[item.city]} · {item.time}</span>
          <a href="#" className="wa-btn">💬 WA</a>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function HousingPage() {
  const { lang, switchLang } = useLang()

  // Basic filters
  const [type,     setType]     = useState('all')
  const [rooms,    setRooms]    = useState('all')
  const [city,     setCity]     = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // Advanced filters
  const [areaMin,   setAreaMin]   = useState('')
  const [areaMax,   setAreaMax]   = useState('')
  const [floorMin,  setFloorMin]  = useState('')
  const [condition, setCondition] = useState('all')
  const [seller,    setSeller]    = useState('all')
  const [withPhoto, setWithPhoto] = useState(false)

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [advOpen,     setAdvOpen]     = useState(false)
  const [sort,        setSort]        = useState('new')

  function resetAll() {
    setType('all'); setRooms('all'); setCity('all')
    setPriceMin(''); setPriceMax(''); setAreaMin(''); setAreaMax('')
    setFloorMin(''); setCondition('all'); setSeller('all'); setWithPhoto(false)
  }

  const basicActive = [type!=='all',rooms!=='all',city!=='all',priceMin,priceMax].filter(Boolean).length
  const advActive   = [areaMin,areaMax,floorMin,condition!=='all',seller!=='all',withPhoto].filter(Boolean).length
  const totalActive = basicActive + advActive

  let results = LISTINGS.filter(l => {
    if (type!=='all'  && l.type!==type)   return false
    if (city!=='all'  && l.city!==city)   return false
    if (rooms!=='all') {
      const r = parseInt(rooms)
      if (rooms==='5' ? l.rooms < 5 : l.rooms !== r) return false
    }
    if (priceMin && l.price < parseInt(priceMin)) return false
    if (priceMax && l.price > parseInt(priceMax)) return false
    if (areaMin  && l.area  < parseInt(areaMin))  return false
    if (areaMax  && l.area  > parseInt(areaMax))  return false
    if (floorMin && l.floor < parseInt(floorMin)) return false
    if (condition!=='all' && l.condition!==condition) return false
    if (seller!=='all'    && l.seller!==seller)       return false
    if (withPhoto && !l.withPhoto) return false
    return true
  })

  if (sort==='cheap')     results = [...results].sort((a,b)=>a.price-b.price)
  if (sort==='expensive') results = [...results].sort((a,b)=>b.price-a.price)
  if (sort==='area')      results = [...results].sort((a,b)=>b.area-a.area)

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
          <span>Жильё</span>
        </div>
      </div>

      {/* BANNER */}
      <div className="cat-banner housing-banner">
        <div className="cat-banner-inner">
          <div className="cat-banner-left">
            <h1 className="cat-banner-title">Найди дом,<br/><em>где хочется жить</em></h1>
            <p className="cat-banner-sub">Аренда и продажа · Хозяева и агентства · По всему Израилю</p>
            <div className="cat-stats">
              <div className="cat-stat"><div className="cat-stat-n">{LISTINGS.length}+</div><div className="cat-stat-l">Объектов</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">13</div><div className="cat-stat-l">Городов</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">24/7</div><div className="cat-stat-l">Обновления</div></div>
            </div>
          </div>
        </div>
        <div className="banner-filter-bar">
          <button className={`filter-toggle${filtersOpen?' active':''}`} onClick={()=>setFiltersOpen(!filtersOpen)}>
            ⚙️ Фильтры {totalActive>0 && <span className="filter-badge">{totalActive}</span>}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className={`filters-panel${filtersOpen?' open':''}`}>
        <div className="filters-inner">

          {/* ГЛАВНЫЕ — тип + комнаты крупно */}
          <div className="filter-row filter-row-top">
            <div className="f-block f-block-lg">
              <label className="f-label">Тип сделки</label>
              <select className="f-sel f-sel-lg" value={type} onChange={e=>setType(e.target.value)}>
                {TYPES.map(t=><option key={t.val} value={t.val}>{t.label}</option>)}
              </select>
            </div>
            <div className="f-block f-block-lg">
              <label className="f-label">Комнат</label>
              <select className="f-sel f-sel-lg" value={rooms} onChange={e=>setRooms(e.target.value)}>
                {ROOMS.map(r=><option key={r.val} value={r.val}>{r.label}</option>)}
              </select>
            </div>
            <div className="f-block">
              <label className="f-label">Город</label>
              <select className="f-sel" value={city} onChange={e=>setCity(e.target.value)}>
                {Object.entries(CITIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="f-block">
              <label className="f-label">Цена от (₪)</label>
              <input className="f-input" type="number" placeholder="0" value={priceMin} onChange={e=>setPriceMin(e.target.value)}/>
            </div>
            <div className="f-block">
              <label className="f-label">Цена до (₪)</label>
              <input className="f-input" type="number" placeholder="∞" value={priceMax} onChange={e=>setPriceMax(e.target.value)}/>
            </div>
          </div>

          {/* РАСШИРЕННЫЙ */}
          <button className={`adv-toggle${advOpen?' open':''}`} onClick={()=>setAdvOpen(!advOpen)}>
            {advOpen?'▲ Скрыть расширенный поиск':'▼ Расширенный поиск'}
            {advActive>0 && <span className="filter-badge-adv">{advActive}</span>}
          </button>

          {advOpen && (
            <div className="filter-row adv-row">
              <div className="f-block">
                <label className="f-label">Площадь от (м²)</label>
                <input className="f-input" type="number" placeholder="0" value={areaMin} onChange={e=>setAreaMin(e.target.value)}/>
              </div>
              <div className="f-block">
                <label className="f-label">Площадь до (м²)</label>
                <input className="f-input" type="number" placeholder="∞" value={areaMax} onChange={e=>setAreaMax(e.target.value)}/>
              </div>
              <div className="f-block">
                <label className="f-label">Этаж от</label>
                <input className="f-input" type="number" placeholder="Любой" value={floorMin} onChange={e=>setFloorMin(e.target.value)}/>
              </div>
              <div className="f-block">
                <label className="f-label">Состояние</label>
                <select className="f-sel" value={condition} onChange={e=>setCondition(e.target.value)}>
                  {CONDITIONS.map(c=><option key={c.val} value={c.val}>{c.label}</option>)}
                </select>
              </div>
              <div className="f-block">
                <label className="f-label">Продавец</label>
                <select className="f-sel" value={seller} onChange={e=>setSeller(e.target.value)}>
                  {SELLERS.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}
                </select>
              </div>
              <div className="f-block f-check-block">
                <label className="f-label">Опции</label>
                <label className="f-check">
                  <input type="checkbox" checked={withPhoto} onChange={e=>setWithPhoto(e.target.checked)}/>
                  <span>Только с фото</span>
                </label>
              </div>
            </div>
          )}

          <div className="filter-actions">
            <button className="btn-reset" onClick={resetAll}>✕ Сбросить всё</button>
            <div className="results-count">{results.length} объектов</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="main">
        <div className="cards-hd">
          <div className="cards-label">
            {results.length>0 ? `Найдено: ${results.length}` : 'Ничего не найдено'}
          </div>
          <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="new">Новые сначала</option>
            <option value="cheap">Дешевле</option>
            <option value="expensive">Дороже</option>
            <option value="area">Больше площадь</option>
          </select>
        </div>

        {results.length>0 ? (
          <div className="cards-grid">
            {results.map((item,i)=>(
              <div key={item.id} style={{animationDelay:`${i*0.05}s`}}>
                <Card item={item}/>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Ничего не найдено</div>
            <div className="empty-sub">Попробуйте изменить фильтры</div>
            <button className="btn-reset-lg" onClick={resetAll}>Сбросить фильтры</button>
          </div>
        )}

        {results.length>0 && <div className="load-more-wrap"><button className="load-more">Показать ещё</button></div>}
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
.lang-btn{background:transparent;border:none;padding:6px 12px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .2s;}
.lang-btn.active{background:var(--navy);color:white;}
.btn-fav-nav{display:flex;align-items:center;gap:5px;background:transparent;border:1.5px solid var(--border);border-radius:10px;padding:9px 14px;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;color:var(--text);}
.btn-fav-nav:hover{border-color:var(--navy);background:var(--navy-dim);}
.fav-count{font-size:12px;font-weight:700;color:var(--muted);}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.btn-login:hover{border-color:var(--navy);background:var(--navy-dim);}
.btn-post{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 22px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(27,45,107,0.22);}

.breadcrumb-wrap{background:white;border-bottom:1px solid var(--border);}
.breadcrumb{max-width:1100px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:8px;font-size:13px;}
.breadcrumb a{color:var(--muted);text-decoration:none;}
.breadcrumb a:hover{color:var(--navy);}
.breadcrumb span{color:var(--text);font-weight:600;}
.bc-sep{color:var(--muted);}

.cat-banner{background:linear-gradient(135deg,#1B4D6B 0%,#1B6B8A 60%,#1B8AA8 100%);overflow:hidden;position:relative;}
.cat-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(27,138,168,0.3) 0%,transparent 65%);}
.cat-banner-inner{max-width:1100px;margin:0 auto;padding:36px 32px 28px;display:flex;align-items:center;justify-content:space-between;gap:24px;position:relative;z-index:1;}
.cat-banner-left{flex:1;}
.cat-banner-title{font-family:'Playfair Display',serif;font-size:clamp(20px,2.8vw,34px);font-weight:900;color:white;letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;}
.cat-banner-title em{font-style:italic;color:#7DD3F0;}
.cat-banner-sub{font-size:13px;color:rgba(255,255,255,0.55);margin-bottom:22px;letter-spacing:0.2px;}
.cat-stats{display:flex;align-items:center;gap:20px;}
.cat-stat{text-align:left;}
.cat-stat-n{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:white;line-height:1;}
.cat-stat-l{font-size:10px;color:rgba(255,255,255,0.45);margin-top:2px;text-transform:uppercase;letter-spacing:0.5px;}
.cat-stat-div{width:1px;height:28px;background:rgba(255,255,255,0.2);}
.banner-filter-bar{max-width:1100px;margin:0 auto;padding:0 32px 20px;position:relative;z-index:1;}
.filter-toggle{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.2);border-radius:11px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:white;cursor:pointer;transition:all .2s;}
.filter-toggle:hover,.filter-toggle.active{background:rgba(255,255,255,0.22);border-color:rgba(255,255,255,0.4);}
.filter-badge{background:white;color:var(--navy);font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;}

.filters-panel{background:white;border-bottom:1px solid var(--border);max-height:0;overflow:hidden;transition:max-height .4s ease;}
.filters-panel.open{max-height:700px;}
.filters-inner{max-width:1100px;margin:0 auto;padding:24px 32px 20px;}
.filter-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;}
.filter-row-top{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.adv-row{padding-top:12px;border-top:1px solid var(--border);margin-top:4px;}
.f-block{display:flex;flex-direction:column;gap:5px;min-width:130px;flex:1;}
.f-block-lg{min-width:180px;flex:2;}
.f-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;}
.f-sel,.f-input,.f-sel-lg{background:var(--cream);border:1.5px solid var(--border);border-radius:9px;padding:9px 12px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);outline:none;transition:border-color .2s;width:100%;}
.f-sel:focus,.f-input:focus,.f-sel-lg:focus{border-color:var(--navy-lt);background:white;}
.f-sel option,.f-sel-lg option{background:white;}
.f-sel-lg{padding:11px 14px;font-size:14px;font-weight:600;color:var(--navy);}
.f-check-block{justify-content:flex-end;}
.f-check{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:500;padding:9px 0;}
.f-check input{width:16px;height:16px;accent-color:var(--navy);cursor:pointer;}
.adv-toggle{background:transparent;border:none;padding:8px 0;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--navy-mid);cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.filter-badge-adv{background:var(--navy);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;}
.filter-actions{display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--border);}
.btn-reset{background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 18px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .2s;}
.btn-reset:hover{border-color:var(--navy);color:var(--navy);}
.results-count{font-size:13px;font-weight:600;color:var(--navy);}

.main{max-width:1100px;margin:0 auto;padding:0 32px;}
.cards-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-top:32px;}
.cards-label{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);}
.sort-sel{background:white;border:1.5px solid var(--border);border-radius:8px;padding:8px 13px;font-family:'Inter',sans-serif;font-size:12px;color:var(--text);outline:none;cursor:pointer;}

.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:64px;}
.card{background:white;border:1.5px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .25s;box-shadow:0 2px 12px rgba(27,45,107,0.05);animation:fadeUp .5s ease both;}
.card:hover{border-color:var(--navy-lt);transform:translateY(-5px);box-shadow:0 20px 50px rgba(27,45,107,0.12);}
.card-img{height:168px;background:linear-gradient(135deg,var(--cream2) 0%,var(--cream3) 100%);display:flex;align-items:center;justify-content:center;font-size:54px;position:relative;}
.badge-vip{position:absolute;top:10px;left:10px;background:var(--gold);color:white;font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;}
.badge-type{position:absolute;bottom:10px;left:10px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;}
.badge-type.rent{background:rgba(27,45,107,0.85);color:white;}
.badge-type.sale{background:rgba(184,137,42,0.9);color:white;}
.btn-fav{position:absolute;top:10px;right:10px;background:white;border:1px solid var(--border);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:transform .2s;}
.btn-fav:hover{transform:scale(1.15);}
.card-body{padding:13px 15px 15px;}
.card-price{font-family:'Playfair Display',serif;font-size:21px;font-weight:700;color:var(--navy);margin-bottom:4px;letter-spacing:-.5px;}
.card-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:11px;}
.tag{background:var(--navy-dim);color:var(--navy-mid);font-size:10px;font-weight:600;padding:3px 8px;border-radius:5px;}
.card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border);}
.card-loc{font-size:11px;color:var(--muted);}
.wa-btn{background:#22C55E;color:white;text-decoration:none;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;}

.empty-state{text-align:center;padding:80px 20px;}
.empty-icon{font-size:48px;margin-bottom:16px;}
.empty-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:8px;}
.empty-sub{font-size:14px;color:var(--muted);margin-bottom:24px;}
.btn-reset-lg{background:var(--navy);color:white;border:none;border-radius:12px;padding:12px 32px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}
.load-more-wrap{text-align:center;padding-bottom:64px;}
.load-more{background:transparent;border:1.5px solid var(--border);border-radius:12px;padding:13px 44px;color:var(--muted);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.load-more:hover{border-color:var(--navy);color:var(--navy);}

footer{background:var(--navy);}
.footer-bottom{max-width:1100px;margin:0 auto;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:rgba(255,255,255,0.3);}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;}
.footer-legal a:hover{color:rgba(255,255,255,0.7);}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:900px){.cards-grid{grid-template-columns:1fr 1fr}.f-block{min-width:120px}}
@media(max-width:640px){.cards-grid{grid-template-columns:1fr}nav{padding:0 16px}.main{padding:0 16px}.filters-inner{padding:16px}.cat-banner-inner{padding:24px 16px 16px}.banner-filter-bar{padding:0 16px 16px}}
.card-price,.cat-stat-n,.card-loc,.card-tags,.tag,.f-input{direction:ltr;unicode-bidi:embed;}
[dir="rtl"] .card-price,[dir="rtl"] .cat-stat-n{text-align:right;}
`
