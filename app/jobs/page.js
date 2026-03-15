'use client'

import { useState } from 'react'
import { useLang } from '@/lib/useLang'
import Link from 'next/link'

// ─── DATA ──────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1,  icon:'💻', vip:true,  salary:22000, salaryStr:'₪ 22 000 / мес', title:'Senior Full-Stack Developer',    sphere:'it',       format:'remote',  exp:'senior', city:'tlv',   type:'job',    time:'Сегодня' },
  { id:2,  icon:'📊', vip:false, salary:18000, salaryStr:'₪ 18 000 / мес', title:'Финансовый аналитик',            sphere:'finance',  format:'office',  exp:'mid',    city:'tlv',   type:'job',    time:'Вчера'   },
  { id:3,  icon:'🏗️', vip:false, salary:12000, salaryStr:'₪ 12 000 / мес', title:'Прораб на стройку',              sphere:'building', format:'office',  exp:'mid',    city:'haifa', type:'job',    time:'2 дня'   },
  { id:4,  icon:'👨‍⚕️', vip:true,  salary:25000, salaryStr:'₪ 25 000 / мес', title:'Врач общей практики',           sphere:'medicine', format:'office',  exp:'senior', city:'jeru',  type:'job',    time:'Сегодня' },
  { id:5,  icon:'🎨', vip:false, salary:16000, salaryStr:'₪ 16 000 / мес', title:'UX/UI Designer — стартап',       sphere:'it',       format:'hybrid',  exp:'mid',    city:'tlv',   type:'job',    time:'2 дня'   },
  { id:6,  icon:'📦', vip:false, salary:8500,  salaryStr:'₪ 8 500 / мес',  title:'Водитель-курьер, авто компании', sphere:'logistics',format:'office',  exp:'junior', city:'rishon',type:'job',    time:'3 дня'   },
  { id:7,  icon:'🍽️', vip:false, salary:9000,  salaryStr:'₪ 9 000 / мес',  title:'Шеф-повар, ресторан в ТА',      sphere:'service',  format:'office',  exp:'mid',    city:'tlv',   type:'job',    time:'Вчера'   },
  { id:8,  icon:'📱', vip:true,  salary:20000, salaryStr:'₪ 20 000 / мес', title:'Product Manager, fintech',       sphere:'it',       format:'hybrid',  exp:'senior', city:'tlv',   type:'job',    time:'Сегодня' },
  { id:9,  icon:'🔧', vip:false, salary:11000, salaryStr:'₪ 11 000 / мес', title:'Электрик — частные заказы',      sphere:'building', format:'remote',  exp:'mid',    city:'net',   type:'job',    time:'4 дня'   },
  { id:10, icon:'📚', vip:false, salary:10000, salaryStr:'₪ 10 000 / мес', title:'Учитель математики, школа',      sphere:'education',format:'office',  exp:'mid',    city:'beer',  type:'job',    time:'3 дня'   },
  { id:11, icon:'💰', vip:true,  salary:0,     salaryStr:'Договорная',     title:'Бухгалтер — ищу работу',         sphere:'finance',  format:'hybrid',  exp:'senior', city:'tlv',   type:'resume', time:'Сегодня' },
  { id:12, icon:'💻', vip:false, salary:0,     salaryStr:'от ₪ 18 000',    title:'React Developer — резюме',       sphere:'it',       format:'remote',  exp:'mid',    city:'haifa', type:'resume', time:'Вчера'   },
]

const CITIES   = { all:'Весь Израиль', tlv:'Тель-Авив', haifa:'Хайфа', jeru:'Иерусалим', net:'Нетания', rishon:'Ришон ле-Цион', beer:'Беэр-Шева', ashdod:'Ашдод' }
const SPHERES  = [{ val:'all',label:'Все сферы' },{ val:'it',label:'IT и Tech' },{ val:'finance',label:'Финансы' },{ val:'medicine',label:'Медицина' },{ val:'building',label:'Строительство' },{ val:'logistics',label:'Логистика' },{ val:'service',label:'Сервис и HoReCa' },{ val:'education',label:'Образование' }]
const FORMATS  = [{ val:'all',label:'Любой формат' },{ val:'office',label:'Офис' },{ val:'remote',label:'Удалённо' },{ val:'hybrid',label:'Гибрид' }]
const TYPES    = [{ val:'all',label:'Вакансии и резюме' },{ val:'job',label:'Вакансии' },{ val:'resume',label:'Резюме' }]
const EXP      = [{ val:'all',label:'Любой опыт' },{ val:'junior',label:'Junior' },{ val:'mid',label:'Middle' },{ val:'senior',label:'Senior' }]

function Card({ item }) {
  const [fav, setFav] = useState(false)
  const sphereLabel  = { it:'IT', finance:'Финансы', medicine:'Медицина', building:'Строительство', logistics:'Логистика', service:'Сервис', education:'Образование' }
  const formatLabel  = { office:'Офис', remote:'Удалённо', hybrid:'Гибрид' }
  const expLabel     = { junior:'Junior', mid:'Middle', senior:'Senior' }
  const typeLabel    = { job:'Вакансия', resume:'Резюме' }
  return (
    <div className="card">
      <div className="card-img">
        <span>{item.icon}</span>
        {item.vip && <div className="badge-vip">⭐ VIP</div>}
        <div className={`badge-type ${item.type}`}>{typeLabel[item.type]}</div>
        <button className="btn-fav" onClick={()=>setFav(!fav)}>{fav?'❤️':'🤍'}</button>
      </div>
      <div className="card-body">
        <div className="card-price">{item.salaryStr}</div>
        <div className="card-title">{item.title}</div>
        <div className="card-tags">
          <span className="tag">{sphereLabel[item.sphere]}</span>
          <span className="tag">{formatLabel[item.format]}</span>
          <span className="tag">{expLabel[item.exp]}</span>
        </div>
        <div className="card-footer">
          <span className="card-loc">📍 {CITIES[item.city]} · {item.time}</span>
          <a href="#" className="wa-btn">💬 WA</a>
        </div>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const { lang, switchLang } = useLang()

  const [type,      setType]      = useState('all')
  const [sphere,    setSphere]    = useState('all')
  const [format,    setFormat]    = useState('all')
  const [city,      setCity]      = useState('all')
  const [salaryMin, setSalaryMin] = useState('')
  const [exp,       setExp]       = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [sort,        setSort]        = useState('new')

  function resetAll() {
    setType('all'); setSphere('all'); setFormat('all')
    setCity('all'); setSalaryMin(''); setExp('all')
  }

  const totalActive = [type!=='all',sphere!=='all',format!=='all',city!=='all',salaryMin,exp!=='all'].filter(Boolean).length

  let results = LISTINGS.filter(l => {
    if (type!=='all'   && l.type!==type)     return false
    if (sphere!=='all' && l.sphere!==sphere) return false
    if (format!=='all' && l.format!==format) return false
    if (city!=='all'   && l.city!==city)     return false
    if (salaryMin && l.salary < parseInt(salaryMin)) return false
    if (exp!=='all'    && l.exp!==exp)       return false
    return true
  })

  if (sort==='salary') results = [...results].sort((a,b)=>b.salary-a.salary)

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
          <button className="btn-fav-nav">♡ <span className="fav-count">0</span></button>
          <button className="btn-login">Войти</button>
          <button className="btn-post">+ Подать объявление</button>
        </div>
      </nav>

      <div className="breadcrumb-wrap">
        <div className="breadcrumb">
          <Link href="/">Главная</Link>
          <span className="bc-sep">→</span>
          <span>Работа</span>
        </div>
      </div>

      <div className="cat-banner">
        <div className="cat-banner-inner">
          <div className="cat-banner-left">
            <h1 className="cat-banner-title">Работа которая<br/><em>тебя достойна</em></h1>
            <p className="cat-banner-sub">Вакансии и резюме · IT, медицина, строительство · По всему Израилю</p>
            <div className="cat-stats">
              <div className="cat-stat"><div className="cat-stat-n">{LISTINGS.length}+</div><div className="cat-stat-l">Вакансий</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">8</div><div className="cat-stat-l">Сфер</div></div>
              <div className="cat-stat-div"/>
              <div className="cat-stat"><div className="cat-stat-n">Remote</div><div className="cat-stat-l">Доступно</div></div>
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
          <div className="filter-row filter-row-top">
            <div className="f-block f-block-lg">
              <label className="f-label">Сфера</label>
              <select className="f-sel f-sel-lg" value={sphere} onChange={e=>setSphere(e.target.value)}>
                {SPHERES.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}
              </select>
            </div>
            <div className="f-block f-block-lg">
              <label className="f-label">Тип</label>
              <select className="f-sel f-sel-lg" value={type} onChange={e=>setType(e.target.value)}>
                {TYPES.map(t=><option key={t.val} value={t.val}>{t.label}</option>)}
              </select>
            </div>
            <div className="f-block">
              <label className="f-label">Формат</label>
              <select className="f-sel" value={format} onChange={e=>setFormat(e.target.value)}>
                {FORMATS.map(f=><option key={f.val} value={f.val}>{f.label}</option>)}
              </select>
            </div>
            <div className="f-block">
              <label className="f-label">Город</label>
              <select className="f-sel" value={city} onChange={e=>setCity(e.target.value)}>
                {Object.entries(CITIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="f-block">
              <label className="f-label">Зарплата от (₪)</label>
              <input className="f-input" type="number" placeholder="0" value={salaryMin} onChange={e=>setSalaryMin(e.target.value)}/>
            </div>
            <div className="f-block">
              <label className="f-label">Опыт</label>
              <select className="f-sel" value={exp} onChange={e=>setExp(e.target.value)}>
                {EXP.map(e=><option key={e.val} value={e.val}>{e.label}</option>)}
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-reset" onClick={resetAll}>✕ Сбросить всё</button>
            <div className="results-count">{results.length} объявлений</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="cards-hd">
          <div className="cards-label">{results.length>0?`Найдено: ${results.length}`:'Ничего не найдено'}</div>
          <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="new">Новые сначала</option>
            <option value="salary">Выше зарплата</option>
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
.btn-fav-nav{display:flex;align-items:center;gap:5px;background:transparent;border:1.5px solid var(--border);border-radius:10px;padding:9px 14px;font-family:'Inter',sans-serif;font-size:14px;cursor:pointer;color:var(--text);}
.fav-count{font-size:12px;font-weight:700;color:var(--muted);}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}
.btn-post{background:var(--navy);color:white;border:none;border-radius:10px;padding:10px 22px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(27,45,107,0.22);}
.breadcrumb-wrap{background:white;border-bottom:1px solid var(--border);}
.breadcrumb{max-width:1100px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:8px;font-size:13px;}
.breadcrumb a{color:var(--muted);text-decoration:none;}
.breadcrumb a:hover{color:var(--navy);}
.breadcrumb span{color:var(--text);font-weight:600;}
.bc-sep{color:var(--muted);}
.cat-banner{background:linear-gradient(135deg,#1B4D3B 0%,#1B6B4D 60%,#1B8A62 100%);overflow:hidden;position:relative;}
.cat-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(27,138,98,0.3) 0%,transparent 65%);}
.cat-banner-inner{max-width:1100px;margin:0 auto;padding:36px 32px 28px;display:flex;align-items:center;position:relative;z-index:1;}
.cat-banner-left{flex:1;}
.cat-banner-title{font-family:'Playfair Display',serif;font-size:clamp(20px,2.8vw,34px);font-weight:900;color:white;letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;}
.cat-banner-title em{font-style:italic;color:#6EE7B7;}
.cat-banner-sub{font-size:13px;color:rgba(255,255,255,0.55);margin-bottom:22px;}
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
.filters-panel.open{max-height:500px;}
.filters-inner{max-width:1100px;margin:0 auto;padding:24px 32px 20px;}
.filter-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;}
.filter-row-top{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.f-block{display:flex;flex-direction:column;gap:5px;min-width:130px;flex:1;}
.f-block-lg{min-width:180px;flex:2;}
.f-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;}
.f-sel,.f-input,.f-sel-lg{background:var(--cream);border:1.5px solid var(--border);border-radius:9px;padding:9px 12px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);outline:none;transition:border-color .2s;width:100%;}
.f-sel:focus,.f-input:focus,.f-sel-lg:focus{border-color:var(--navy-lt);background:white;}
.f-sel option,.f-sel-lg option{background:white;}
.f-sel-lg{padding:11px 14px;font-size:14px;font-weight:600;color:var(--navy);}
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
.badge-type.job{background:rgba(27,77,59,0.85);color:white;}
.badge-type.resume{background:rgba(27,45,107,0.85);color:white;}
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
