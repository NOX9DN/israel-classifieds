'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── MOCK DATA ──────────────────────────────────────────────────────────────────
const INIT_LISTINGS = [
  { id:1,  title:'Toyota Camry 2021 Hybrid',   category:'auto',    price:'₪ 89 000',   user:'Александр К.', phone:'+972501234567', status:'active',  vip:true,  vipExpiry:'21.03.2025', views:142, created:'14.03.2025' },
  { id:2,  title:'3 комнаты, ул. Дизенгоф',    category:'housing', price:'₪ 7 200/мес',user:'Марина Л.',    phone:'+972521234567', status:'active',  vip:false, vipExpiry:null,         views:89,  created:'14.03.2025' },
  { id:3,  title:'Senior Full-Stack Developer', category:'jobs',    price:'₪ 22 000',   user:'Давид М.',     phone:'+972531234567', status:'pending', vip:false, vipExpiry:null,         views:0,   created:'14.03.2025' },
  { id:4,  title:'BMW X5 2022 xDrive40d',       category:'auto',    price:'₪ 115 000',  user:'Михаил Р.',    phone:'+972541234567', status:'pending', vip:false, vipExpiry:null,         views:0,   created:'13.03.2025' },
  { id:5,  title:'Студия, центр Хайфы',         category:'housing', price:'₪ 4 800/мес',user:'Ольга Т.',    phone:'+972561234567', status:'active',  vip:false, vipExpiry:null,         views:56,  created:'13.03.2025' },
  { id:6,  title:'Tesla Model 3 2023 LR',       category:'auto',    price:'₪ 128 000',  user:'Игорь С.',     phone:'+972571234567', status:'pending', vip:false, vipExpiry:null,         views:0,   created:'13.03.2025' },
  { id:7,  title:'UX/UI Designer — стартап',    category:'jobs',    price:'₪ 16 000',   user:'Анна В.',      phone:'+972581234567', status:'active',  vip:false, vipExpiry:null,         views:34,  created:'12.03.2025' },
  { id:8,  title:'Kia Sportage 2018',           category:'auto',    price:'₪ 44 900',   user:'Сергей П.',    phone:'+972551234567', status:'blocked', vip:false, vipExpiry:null,         views:12,  created:'12.03.2025' },
  { id:9,  title:'4 комнаты, Рамат-Ган',        category:'housing', price:'₪ 9 500/мес',user:'Борис Н.',    phone:'+972591234567', status:'active',  vip:true,  vipExpiry:'16.03.2025', views:78,  created:'11.03.2025' },
  { id:10, title:'Врач общей практики',         category:'jobs',    price:'₪ 25 000',   user:'Елена К.',     phone:'+972501111111', status:'pending', vip:false, vipExpiry:null,         views:0,   created:'11.03.2025' },
]

const INIT_USERS = [
  { id:1, name:'Александр К.', phone:'+972501234567', listings:3, vip:true,  vipExpiry:'21.03.2025', joined:'01.03.2025', status:'active',  notes:'Оплатил VIP 14.03 через Bit. Постоянный клиент.' },
  { id:2, name:'Марина Л.',    phone:'+972521234567', listings:1, vip:false, vipExpiry:null,         joined:'05.03.2025', status:'active',  notes:'' },
  { id:3, name:'Давид М.',     phone:'+972531234567', listings:2, vip:false, vipExpiry:null,         joined:'07.03.2025', status:'active',  notes:'Просил скидку на VIP — отказал.' },
  { id:4, name:'Михаил Р.',    phone:'+972541234567', listings:1, vip:false, vipExpiry:null,         joined:'10.03.2025', status:'active',  notes:'' },
  { id:5, name:'Сергей П.',    phone:'+972551234567', listings:1, vip:false, vipExpiry:null,         joined:'11.03.2025', status:'blocked', notes:'Спам объявления. Заблокирован 12.03.' },
  { id:6, name:'Ольга Т.',     phone:'+972561234567', listings:2, vip:false, vipExpiry:null,         joined:'12.03.2025', status:'active',  notes:'' },
  { id:7, name:'Борис Н.',     phone:'+972591234567', listings:1, vip:true,  vipExpiry:'16.03.2025', joined:'09.03.2025', status:'active',  notes:'VIP истекает 16.03 — напомнить о продлении.' },
]

const INIT_LOG = [
  { id:1, action:'approve', text:'Объявление "Toyota Camry 2021" одобрено',         time:'14.03 14:22' },
  { id:2, action:'vip',     text:'VIP выдан "Александр К." до 21.03',               time:'14.03 13:10' },
  { id:3, action:'block',   text:'Пользователь "Сергей П." заблокирован',           time:'12.03 18:45' },
  { id:4, action:'approve', text:'Объявление "4 комнаты, Рамат-Ган" одобрено',      time:'11.03 11:30' },
  { id:5, action:'vip',     text:'VIP выдан "Борис Н." до 16.03',                   time:'09.03 16:00' },
]

const catLabel = { auto:'🚗 Авто', housing:'🏠 Жильё', jobs:'💼 Работа' }
const catColor = { auto:'cat-auto', housing:'cat-housing', jobs:'cat-jobs' }

// ─── VIP DAYS HELPER ───────────────────────────────────────────────────────────
function vipDaysLeft(expiry) {
  if (!expiry) return null
  const [d,m,y] = expiry.split('.').map(Number)
  const exp  = new Date(y, m-1, d)
  const now  = new Date()
  return Math.ceil((exp - now) / (1000*60*60*24))
}

function VipBadge({ expiry }) {
  if (!expiry) return null
  const days = vipDaysLeft(expiry)
  const cls  = days <= 2 ? 'vip-exp-red' : days <= 5 ? 'vip-exp-yellow' : 'vip-exp-green'
  return <span className={`vip-exp ${cls}`}>⭐ VIP · {days > 0 ? `${days}д` : 'истёк'}</span>
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab,        setTab]        = useState('dashboard')
  const [listFilter, setListFilter] = useState('all')
  const [listings,   setListings]   = useState(INIT_LISTINGS)
  const [users,      setUsers]      = useState(INIT_USERS)
  const [log,        setLog]        = useState(INIT_LOG)
  const [search,     setSearch]     = useState('')
  const [toast,      setToast]      = useState('')
  const [noteModal,  setNoteModal]  = useState(null)
  const [vipModal,   setVipModal]   = useState(null)
  const [vipDays,    setVipDays]    = useState('7')
  const [dark, setDark] = useState(false)

  // Вешаем тему на <html> — единственный правильный способ
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-admin-theme', dark ? 'dark' : 'light')
  }

  const [authed, setAuthed] = useState(false)
  const [pwd,    setPwd]    = useState('')
  const ADMIN_PWD = 'admin2025'

  function addLog(action, text) {
    const now = new Date()
    const time = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
    setLog(prev => [{ id: Date.now(), action, text, time }, ...prev.slice(0, 19)])
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function approve(id) {
    const l = listings.find(x=>x.id===id)
    setListings(prev => prev.map(x => x.id===id ? {...x, status:'active'} : x))
    addLog('approve', `Объявление "${l.title}" одобрено`)
    showToast('✓ Объявление одобрено')
  }
  function reject(id) {
    const l = listings.find(x=>x.id===id)
    setListings(prev => prev.map(x => x.id===id ? {...x, status:'blocked'} : x))
    addLog('block', `Объявление "${l.title}" заблокировано`)
    showToast('✗ Заблокировано')
  }
  function deleteListing(id) {
    const l = listings.find(x=>x.id===id)
    setListings(prev => prev.filter(x => x.id!==id))
    addLog('delete', `Объявление "${l.title}" удалено`)
    showToast('🗑 Удалено')
  }

  function openVipModal(id, type) { setVipModal({ id, type }); setVipDays('7') }
  function applyVip() {
    if (!vipModal) return
    const days = parseInt(vipDays) || 7
    const exp  = new Date(); exp.setDate(exp.getDate() + days)
    const expStr = `${exp.getDate().toString().padStart(2,'0')}.${(exp.getMonth()+1).toString().padStart(2,'0')}.${exp.getFullYear()}`

    if (vipModal.type === 'listing') {
      const l = listings.find(x=>x.id===vipModal.id)
      setListings(prev => prev.map(x => x.id===vipModal.id ? {...x, vip:true, vipExpiry:expStr} : x))
      addLog('vip', `VIP выдан объявлению "${l.title}" до ${expStr}`)
      showToast(`⭐ VIP выдан на ${days} дней`)
    } else {
      const u = users.find(x=>x.id===vipModal.id)
      setUsers(prev => prev.map(x => x.id===vipModal.id ? {...x, vip:true, vipExpiry:expStr} : x))
      addLog('vip', `VIP выдан "${u.name}" до ${expStr}`)
      showToast(`⭐ VIP выдан на ${days} дней`)
    }
    setVipModal(null)
  }
  function removeVip(id, type) {
    if (type==='listing') {
      const l = listings.find(x=>x.id===id)
      setListings(prev => prev.map(x => x.id===id ? {...x, vip:false, vipExpiry:null} : x))
      addLog('vip', `VIP снят с объявления "${l.title}"`)
    } else {
      const u = users.find(x=>x.id===id)
      setUsers(prev => prev.map(x => x.id===id ? {...x, vip:false, vipExpiry:null} : x))
      addLog('vip', `VIP снят с "${u.name}"`)
    }
    showToast('VIP снят')
  }

  function toggleUserBlock(id) {
    const u = users.find(x=>x.id===id)
    const next = u.status==='active' ? 'blocked' : 'active'
    setUsers(prev => prev.map(x => x.id===id ? {...x, status:next} : x))
    addLog('block', next==='blocked' ? `Пользователь "${u.name}" заблокирован` : `Пользователь "${u.name}" разблокирован`)
    showToast(next==='blocked' ? '🚫 Пользователь заблокирован' : '✓ Пользователь разблокирован')
  }

  function saveNote(userId, text) {
    setUsers(prev => prev.map(u => u.id===userId ? {...u, notes:text} : u))
    setNoteModal(null)
    showToast('📝 Заметка сохранена')
  }

  const pending = listings.filter(l=>l.status==='pending').length
  const vipExpiring = [...listings.filter(l=>l.vip && vipDaysLeft(l.vipExpiry)<=3), ...users.filter(u=>u.vip && vipDaysLeft(u.vipExpiry)<=3)]

  const filteredListings = listings
    .filter(l => listFilter==='all' || l.status===listFilter || l.category===listFilter)
    .filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()))

  // ── Login ──
  if (!authed) return (
    <>
      <style>{CSS}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Израил<span>.</span>ру</div>
          <div className="login-sub">Панель администратора</div>
          <input className="login-input" type="password" placeholder="Пароль" value={pwd}
            onChange={e=>setPwd(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && pwd===ADMIN_PWD && setAuthed(true)}
          />
          <button className="login-btn" onClick={()=> pwd===ADMIN_PWD ? setAuthed(true) : showToast('❌ Неверный пароль')}>
            Войти
          </button>
          {toast && <div className="login-err">{toast}</div>}
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-left">
          <Link className="admin-logo" href="/">Израил<span>.</span>ру</Link>
          <span className="admin-tag">Admin</span>
        </div>
        <div className="top-right">
          {pending > 0 && <div className="alert-pill">🔔 {pending} ждут проверки</div>}
          {vipExpiring.length > 0 && <div className="alert-pill alert-gold">⭐ {vipExpiring.length} VIP истекает скоро</div>}
          <button className="btn-theme" onClick={()=>setDark(!dark)} title={dark?'Светлая тема':'Тёмная тема'}>
            {dark ? '☀️' : '🌙'}
          </button>
          <Link href="/" className="btn-back">← На сайт</Link>
          <button className="btn-out" onClick={()=>setAuthed(false)}>Выйти</button>
        </div>
      </div>

      <div className="layout">

        {/* SIDEBAR */}
        <nav className="sidebar">
          {[
            { key:'dashboard', icon:'📊', label:'Дашборд' },
            { key:'listings',  icon:'📋', label:'Объявления', badge: pending },
            { key:'users',     icon:'👥', label:'Пользователи' },
            { key:'vip',       icon:'⭐', label:'VIP' },
            { key:'log',       icon:'📜', label:'История' },
          ].map(item => (
            <button key={item.key} className={`nav-item${tab===item.key?' active':''}`} onClick={()=>setTab(item.key)}>
              <span>{item.icon} {item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* MAIN */}
        <main className="main-content">

          {/* ── DASHBOARD ── */}
          {tab==='dashboard' && <>
            <h1 className="page-title">Дашборд</h1>

            <div className="stats-row">
              {[
                { icon:'📋', num: listings.length,                         label:'Всего объявлений',   color:'' },
                { icon:'⏳', num: pending,                                  label:'На проверке',        color:'amber' },
                { icon:'👥', num: users.length,                            label:'Пользователей',      color:'' },
                { icon:'⭐', num: listings.filter(l=>l.vip).length,        label:'VIP объявлений',     color:'gold' },
                { icon:'👁', num: listings.reduce((s,l)=>s+l.views,0),     label:'Просмотров всего',   color:'' },
                { icon:'🚫', num: users.filter(u=>u.status==='blocked').length, label:'Заблокировано', color:'red' },
              ].map((s,i)=>(
                <div key={i} className={`stat-box ${s.color}`}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-n">{s.num}</div>
                  <div className="stat-l">{s.label}</div>
                </div>
              ))}
            </div>

            {/* VIP expiring soon */}
            {vipExpiring.length > 0 && (
              <div className="section">
                <h2 className="sec-title">⚠️ VIP истекает в ближайшие 3 дня</h2>
                <div className="expiry-list">
                  {listings.filter(l=>l.vip && vipDaysLeft(l.vipExpiry)<=3).map(l=>(
                    <div key={l.id} className="expiry-item">
                      <div>
                        <div className="expiry-name">{l.title}</div>
                        <div className="expiry-meta">{l.user} · {l.phone}</div>
                      </div>
                      <div className="expiry-right">
                        <VipBadge expiry={l.vipExpiry}/>
                        <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" className="btn-wa-sm">💬 Написать</a>
                      </div>
                    </div>
                  ))}
                  {users.filter(u=>u.vip && vipDaysLeft(u.vipExpiry)<=3).map(u=>(
                    <div key={u.id} className="expiry-item">
                      <div>
                        <div className="expiry-name">{u.name}</div>
                        <div className="expiry-meta">{u.phone}</div>
                      </div>
                      <div className="expiry-right">
                        <VipBadge expiry={u.vipExpiry}/>
                        <a href={`https://wa.me/${u.phone.replace(/\D/g,'')}`} target="_blank" className="btn-wa-sm">💬 Написать</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending */}
            {pending > 0 && (
              <div className="section">
                <h2 className="sec-title">⏳ Ожидают проверки</h2>
                <div className="pending-list">
                  {listings.filter(l=>l.status==='pending').map(l=>(
                    <div key={l.id} className="pending-row">
                      <span className={`cat-tag ${catColor[l.category]}`}>{catLabel[l.category]}</span>
                      <div className="pending-info">
                        <div className="pending-title">{l.title}</div>
                        <div className="pending-meta">{l.user} · {l.price} · {l.created}</div>
                      </div>
                      <div className="row-actions">
                        <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" className="btn-wa-sm">💬</a>
                        <button className="btn-green" onClick={()=>approve(l.id)}>✓ Одобрить</button>
                        <button className="btn-red"   onClick={()=>reject(l.id)}>✗ Отклонить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent log */}
            <div className="section">
              <h2 className="sec-title">📜 Последние действия</h2>
              <div className="log-list">
                {log.slice(0,5).map(entry=>(
                  <div key={entry.id} className="log-row">
                    <span className={`log-dot dot-${entry.action}`}/>
                    <span className="log-text">{entry.text}</span>
                    <span className="log-time">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── LISTINGS ── */}
          {tab==='listings' && <>
            <div className="page-header">
              <h1 className="page-title">Объявления</h1>
              <input className="search-box" placeholder="🔍 Поиск..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>

            <div className="filter-tabs">
              {[
                { val:'all',     label:'Все',         count: listings.length },
                { val:'pending', label:'На проверке', count: listings.filter(l=>l.status==='pending').length },
                { val:'active',  label:'Активные',    count: listings.filter(l=>l.status==='active').length  },
                { val:'blocked', label:'Заблок.',      count: listings.filter(l=>l.status==='blocked').length },
                { val:'auto',    label:'🚗 Авто',      count: listings.filter(l=>l.category==='auto').length  },
                { val:'housing', label:'🏠 Жильё',     count: listings.filter(l=>l.category==='housing').length },
                { val:'jobs',    label:'💼 Работа',    count: listings.filter(l=>l.category==='jobs').length  },
              ].map(f=>(
                <button key={f.val} className={`ftab${listFilter===f.val?' active':''}`} onClick={()=>setListFilter(f.val)}>
                  {f.label} <span className="ftab-n">{f.count}</span>
                </button>
              ))}
            </div>

            <div className="table-card">
              <table className="tbl">
                <thead><tr>
                  <th>Объявление</th><th>Категория</th><th>Продавец</th>
                  <th>Цена</th><th>👁</th><th>Статус</th><th>Действия</th>
                </tr></thead>
                <tbody>
                  {filteredListings.map(l=>(
                    <tr key={l.id}>
                      <td>
                        <div className="td-name">{l.title}</div>
                        <div className="td-sub">{l.created} {l.vip && <VipBadge expiry={l.vipExpiry}/>}</div>
                      </td>
                      <td><span className={`cat-tag ${catColor[l.category]}`}>{catLabel[l.category]}</span></td>
                      <td>
                        <div className="td-name">{l.user}</div>
                        <div className="td-sub" dir="ltr">{l.phone}</div>
                      </td>
                      <td className="td-price" dir="ltr">{l.price}</td>
                      <td className="td-center td-sub">{l.views}</td>
                      <td><span className={`stag s-${l.status}`}>{l.status==='active'?'Активно':l.status==='pending'?'Проверка':'Заблок.'}</span></td>
                      <td>
                        <div className="act-row">
                          <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" className="act-btn wa">💬</a>
                          {l.status==='pending' && <>
                            <button className="act-btn ok" onClick={()=>approve(l.id)}>✓</button>
                            <button className="act-btn no" onClick={()=>reject(l.id)}>✗</button>
                          </>}
                          {l.status==='active'  && <button className="act-btn no"  onClick={()=>reject(l.id)}>🚫</button>}
                          {l.status==='blocked' && <button className="act-btn ok"  onClick={()=>approve(l.id)}>↩</button>}
                          {l.vip
                            ? <button className="act-btn vip-on"  onClick={()=>removeVip(l.id,'listing')} title="Убрать VIP">⭐</button>
                            : <button className="act-btn vip-off" onClick={()=>openVipModal(l.id,'listing')} title="Дать VIP">☆</button>
                          }
                          <button className="act-btn del" onClick={()=>deleteListing(l.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredListings.length===0 && <div className="tbl-empty">Ничего не найдено</div>}
            </div>
          </>}

          {/* ── USERS ── */}
          {tab==='users' && <>
            <h1 className="page-title">Пользователи</h1>
            <div className="table-card">
              <table className="tbl">
                <thead><tr>
                  <th>Пользователь</th><th>Телефон</th><th>Объявлений</th>
                  <th>VIP</th><th>Статус</th><th>Заметки</th><th>Действия</th>
                </tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td>
                        <div className="user-row">
                          <div className="avatar">{u.name[0]}</div>
                          <div>
                            <div className="td-name">{u.name}</div>
                            <div className="td-sub">с {u.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td className="td-sub" dir="ltr">{u.phone}</td>
                      <td className="td-center">{u.listings}</td>
                      <td>{u.vip ? <VipBadge expiry={u.vipExpiry}/> : <span className="td-sub">—</span>}</td>
                      <td><span className={`stag s-${u.status}`}>{u.status==='active'?'Активен':'Заблок.'}</span></td>
                      <td>
                        <div className="notes-cell" onClick={()=>setNoteModal({userId:u.id, text:u.notes})}>
                          {u.notes ? <span className="note-text">{u.notes.slice(0,40)}{u.notes.length>40?'…':''}</span> : <span className="note-empty">+ Добавить</span>}
                        </div>
                      </td>
                      <td>
                        <div className="act-row">
                          <a href={`https://wa.me/${u.phone.replace(/\D/g,'')}`} target="_blank" className="act-btn wa">💬</a>
                          {u.vip
                            ? <button className="act-btn vip-on"  onClick={()=>removeVip(u.id,'user')}>⭐</button>
                            : <button className="act-btn vip-off" onClick={()=>openVipModal(u.id,'user')}>☆</button>
                          }
                          <button className={`act-btn ${u.status==='active'?'no':'ok'}`} onClick={()=>toggleUserBlock(u.id)}>
                            {u.status==='active'?'🚫':'↩'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}

          {/* ── VIP ── */}
          {tab==='vip' && <>
            <h1 className="page-title">Управление VIP</h1>
            <p className="page-sub">VIP объявления показываются первыми и выделяются на сайте. Стандартный срок — 7 дней.</p>

            <h2 className="sec-title" style={{marginBottom:12}}>Активные VIP объявления</h2>
            <div className="vip-cards">
              {listings.filter(l=>l.vip).map(l=>(
                <div key={l.id} className="vip-card">
                  <div className="vip-top">
                    <span className={`cat-tag ${catColor[l.category]}`}>{catLabel[l.category]}</span>
                    <VipBadge expiry={l.vipExpiry}/>
                  </div>
                  <div className="vip-title">{l.title}</div>
                  <div className="vip-meta">{l.user}</div>
                  <div className="vip-phone" dir="ltr">{l.phone}</div>
                  <div className="vip-footer">
                    <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" className="btn-wa-sm">💬 Написать</a>
                    <button className="btn-vip-remove" onClick={()=>removeVip(l.id,'listing')}>Снять VIP</button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="sec-title" style={{marginTop:32,marginBottom:12}}>Без VIP — можно предложить</h2>
            <div className="vip-cards">
              {listings.filter(l=>!l.vip && l.status==='active').map(l=>(
                <div key={l.id} className="vip-card vip-inactive">
                  <div className="vip-top">
                    <span className={`cat-tag ${catColor[l.category]}`}>{catLabel[l.category]}</span>
                    <span className="td-sub">👁 {l.views}</span>
                  </div>
                  <div className="vip-title">{l.title}</div>
                  <div className="vip-meta">{l.user}</div>
                  <div className="vip-phone" dir="ltr">{l.phone}</div>
                  <div className="vip-footer">
                    <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" className="btn-wa-sm">💬 Предложить</a>
                    <button className="btn-vip-give" onClick={()=>openVipModal(l.id,'listing')}>☆ Дать VIP</button>
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ── LOG ── */}
          {tab==='log' && <>
            <h1 className="page-title">История действий</h1>
            <div className="table-card">
              {log.map(entry=>(
                <div key={entry.id} className="log-entry">
                  <span className={`log-dot dot-${entry.action}`}/>
                  <span className="log-text">{entry.text}</span>
                  <span className="log-time">{entry.time}</span>
                </div>
              ))}
              {log.length===0 && <div className="tbl-empty">История пуста</div>}
            </div>
          </>}

        </main>
      </div>

      {/* VIP MODAL */}
      {vipModal && (
        <div className="modal-overlay" onClick={()=>setVipModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">⭐ Выдать VIP</div>
            <div className="modal-sub">На сколько дней?</div>
            <div className="vip-days-row">
              {['3','7','14','30'].map(d=>(
                <button key={d} className={`day-btn${vipDays===d?' active':''}`} onClick={()=>setVipDays(d)}>{d} дн.</button>
              ))}
            </div>
            <input className="day-input" type="number" placeholder="Другое кол-во дней" value={vipDays} onChange={e=>setVipDays(e.target.value)}/>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={()=>setVipModal(null)}>Отмена</button>
              <button className="modal-confirm" onClick={applyVip}>Выдать VIP на {vipDays} дн.</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {noteModal && (
        <div className="modal-overlay" onClick={()=>setNoteModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">📝 Заметка</div>
            <div className="modal-sub">{users.find(u=>u.id===noteModal.userId)?.name}</div>
            <textarea
              className="note-textarea"
              placeholder="Договорённости, оплата, контекст..."
              value={noteModal.text}
              onChange={e=>setNoteModal({...noteModal, text:e.target.value})}
              rows={5}
            />
            <div className="modal-footer">
              <button className="modal-cancel" onClick={()=>setNoteModal(null)}>Отмена</button>
              <button className="modal-confirm" onClick={()=>saveNote(noteModal.userId, noteModal.text)}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&display=swap');

/* ── LIGHT ── */
:root{
  --bg:#EDEAE2;--cream:#F8F6F0;
  --card:#FFFFFF;--sidebar:#FFFFFF;
  --input:#F8F6F0;--tbl-head:#F8F6F0;--tbl-hover:#FAFAF8;
  --navy:#1B2D6B;--nm:#2C45A0;--nl:#4A6FD4;--nd:rgba(27,45,107,0.07);
  --gold:#B8892A;--text:#1A1A2E;--sub:#8A8AA8;--br:rgba(27,45,107,0.1);
  --green:#16a34a;--red:#dc2626;--amber:#d97706;
  --top-bar:#1B2D6B;
}

/* ── DARK ── */
[data-admin-theme="dark"]{
  --bg:#1a1b26;--cream:#1f2235;
  --card:#24283b;--sidebar:#1f2235;
  --input:#2a2f45;--tbl-head:#1f2235;--tbl-hover:#2a2f45;
  --navy:#7aa2f7;--nm:#7aa2f7;--nl:#89b4fa;--nd:rgba(122,162,247,0.1);
  --gold:#e0af68;--text:#c0caf5;--sub:#565f89;--br:rgba(255,255,255,0.07);
  --green:#9ece6a;--red:#f7768e;--amber:#ff9e64;
  --top-bar:#16161e;
}

[data-admin-theme="dark"] body{background:var(--bg) !important;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);transition:background .3s,color .3s;}

.btn-theme{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;width:34px;height:34px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.btn-theme:hover{background:rgba(255,255,255,0.2);}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);}

.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy);}
.login-card{background:var(--card);border-radius:24px;padding:48px 40px;width:360px;text-align:center;}
.login-logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:var(--navy);margin-bottom:6px;}
.login-logo span{color:var(--nm);}
.login-sub{font-size:13px;color:var(--sub);margin-bottom:28px;}
.login-input{width:100%;background:var(--input);border:1.5px solid var(--br);border-radius:10px;padding:13px;font-family:'Inter',sans-serif;font-size:14px;outline:none;margin-bottom:12px;text-align:center;letter-spacing:3px;color:var(--text);}
.login-btn{width:100%;background:var(--navy);color:white;border:none;border-radius:10px;padding:14px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;}
.login-err{margin-top:14px;font-size:13px;color:var(--red);}

.top-bar{height:60px;background:var(--top-bar);padding:0 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.top-left{display:flex;align-items:center;gap:12px;}
.admin-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:20px;color:white;text-decoration:none;}
.admin-logo span{color:rgba(255,255,255,0.4);}
.admin-tag{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.75);font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;}
.top-right{display:flex;align-items:center;gap:8px;}
.alert-pill{background:rgba(239,68,68,0.2);color:#fca5a5;font-size:12px;font-weight:600;padding:5px 12px;border-radius:8px;border:1px solid rgba(239,68,68,0.25);}
.alert-gold{background:rgba(234,179,8,0.2);color:#fde047;border-color:rgba(234,179,8,0.3);}
.btn-back{color:rgba(255,255,255,0.65);text-decoration:none;font-size:13px;padding:7px 14px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;transition:.2s;}
.btn-back:hover{background:rgba(255,255,255,0.1);color:white;}
.btn-out{background:transparent;color:rgba(255,255,255,0.45);border:none;font-size:13px;cursor:pointer;padding:7px;}
.btn-out:hover{color:white;}

.layout{display:flex;min-height:calc(100vh - 60px);}
.sidebar{width:210px;background:var(--sidebar);border-right:1px solid var(--br);padding:16px 10px;flex-shrink:0;transition:background .3s;}
.nav-item{width:100%;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;border-radius:10px;padding:11px 14px;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;color:var(--sub);cursor:pointer;transition:.2s;margin-bottom:3px;text-align:left;}
.nav-item:hover{background:var(--nd);color:var(--navy);}
.nav-item.active{background:var(--navy);color:white;font-weight:600;}
.nav-badge{background:#ef4444;color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;}

.main-content{flex:1;padding:28px 32px;overflow-x:auto;}
.page-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:20px;}
.page-sub{font-size:13px;color:var(--sub);margin:-12px 0 20px;}
.page-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;}
.page-header .page-title{margin-bottom:0;}
.search-box{background:var(--input);border:1.5px solid var(--br);border-radius:9px;padding:9px 14px;font-family:'Inter',sans-serif;font-size:13px;outline:none;width:260px;color:var(--text);}
.search-box:focus{border-color:var(--nl);}

.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;}
.stat-box{background:var(--card);border:1.5px solid var(--br);border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14px;transition:background .3s;}
.stat-box.amber .stat-n{color:var(--amber);}
.stat-box.gold  .stat-n{color:var(--gold);}
.stat-box.red   .stat-n{color:var(--red);}
.stat-icon{font-size:26px;}
.stat-n{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--navy);line-height:1;}
.stat-l{font-size:11px;color:var(--sub);margin-top:3px;}

.section{margin-bottom:28px;}
.sec-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--navy);margin-bottom:14px;}

.expiry-list,.pending-list{display:flex;flex-direction:column;gap:8px;}
.expiry-item,.pending-row{background:var(--card);border:1.5px solid var(--br);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:background .3s;}
.expiry-item{border-color:rgba(234,179,8,0.2);}
.expiry-name,.pending-title{font-size:13px;font-weight:600;color:var(--text);}
.expiry-meta,.pending-meta{font-size:11px;color:var(--sub);margin-top:2px;}
.expiry-right,.row-actions{display:flex;align-items:center;gap:8px;}
.pending-info{flex:1;}

.btn-green{background:rgba(22,163,74,0.12);color:var(--green);border:none;border-radius:8px;padding:7px 14px;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:.2s;}
.btn-green:hover{background:var(--green);color:white;}
.btn-red{background:rgba(220,38,38,0.12);color:var(--red);border:none;border-radius:8px;padding:7px 14px;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:.2s;}
.btn-red:hover{background:var(--red);color:white;}
.btn-wa-sm{background:rgba(34,197,94,0.1);color:#16a34a;text-decoration:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;border:1px solid rgba(34,197,94,0.2);transition:.2s;}
.btn-wa-sm:hover{background:#22C55E;color:white;}

.log-list{display:flex;flex-direction:column;gap:6px;}
.log-entry,.log-row{background:var(--card);border:1px solid var(--br);border-radius:9px;padding:11px 16px;display:flex;align-items:center;gap:10px;transition:background .3s;}
.log-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.dot-approve{background:#22c55e;}.dot-vip{background:var(--gold);}.dot-block{background:var(--red);}.dot-delete{background:var(--sub);}
.log-text{flex:1;font-size:13px;color:var(--text);}
.log-time{font-size:11px;color:var(--sub);white-space:nowrap;}
.tbl-empty{padding:40px;text-align:center;font-size:14px;color:var(--sub);}

.filter-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
.ftab{background:var(--card);border:1.5px solid var(--br);border-radius:8px;padding:6px 12px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;color:var(--sub);cursor:pointer;transition:.2s;display:flex;align-items:center;gap:5px;}
.ftab:hover{border-color:var(--nl);color:var(--navy);}
.ftab.active{background:var(--navy);color:white;border-color:var(--navy);}
.ftab-n{background:rgba(255,255,255,0.15);padding:1px 5px;border-radius:8px;font-size:10px;}
.ftab:not(.active) .ftab-n{background:var(--nd);color:var(--navy);}

.table-card{background:var(--card);border:1.5px solid var(--br);border-radius:14px;overflow:hidden;transition:background .3s;}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{background:var(--tbl-head);padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--sub);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--br);}
.tbl td{padding:11px 14px;border-bottom:1px solid var(--br);vertical-align:middle;color:var(--text);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:var(--tbl-hover);}
.td-name{font-size:13px;font-weight:600;color:var(--text);}
.td-sub{font-size:11px;color:var(--sub);margin-top:2px;}
.td-price{font-size:13px;font-weight:700;color:var(--navy);}
.td-center{text-align:center;}

.act-row{display:flex;gap:4px;}
.act-btn{width:28px;height:28px;border-radius:7px;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:.2s;text-decoration:none;}
.act-btn.wa{background:rgba(34,197,94,0.1);color:#16a34a;}
.act-btn.wa:hover{background:#22c55e;color:white;}
.act-btn.ok{background:rgba(22,163,74,0.1);color:var(--green);}
.act-btn.ok:hover{background:var(--green);color:white;}
.act-btn.no{background:rgba(220,38,38,0.1);color:var(--red);}
.act-btn.no:hover{background:var(--red);color:white;}
.act-btn.vip-on{background:rgba(184,137,42,0.12);color:var(--gold);}
.act-btn.vip-off{background:var(--input);color:var(--sub);}
.act-btn.vip-off:hover{background:rgba(184,137,42,0.12);color:var(--gold);}
.act-btn.del{background:var(--input);color:var(--sub);}
.act-btn.del:hover{background:rgba(220,38,38,0.1);color:var(--red);}

.cat-tag{display:inline-block;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;}
.cat-auto{background:rgba(27,45,107,0.1);color:var(--navy);}
.cat-housing{background:rgba(27,107,138,0.1);color:#1B6B8A;}
.cat-jobs{background:rgba(27,107,59,0.1);color:#1B6B3B;}

.stag{display:inline-block;font-size:11px;font-weight:700;padding:3px 9px;border-radius:6px;}
.s-active{background:rgba(22,163,74,0.12);color:var(--green);}
.s-pending{background:rgba(245,158,11,0.12);color:var(--amber);}
.s-blocked{background:rgba(220,38,38,0.12);color:var(--red);}

.vip-exp{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;}
.vip-exp-green{background:rgba(184,137,42,0.12);color:var(--gold);}
.vip-exp-yellow{background:rgba(245,158,11,0.15);color:var(--amber);}
.vip-exp-red{background:rgba(220,38,38,0.12);color:var(--red);}

.user-row{display:flex;align-items:center;gap:10px;}
.avatar{width:32px;height:32px;border-radius:50%;background:var(--navy);color:white;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;font-weight:700;flex-shrink:0;}

.notes-cell{cursor:pointer;padding:4px 0;}
.note-text{font-size:12px;color:var(--text);line-height:1.4;}
.note-empty{font-size:12px;color:var(--nl);font-weight:600;}

.vip-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.vip-card{background:var(--card);border:1.5px solid rgba(184,137,42,0.25);border-radius:14px;padding:16px;transition:background .3s;}
.vip-inactive{border-color:var(--br);}
.vip-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.vip-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vip-meta{font-size:12px;color:var(--sub);}
.vip-phone{font-size:11px;color:var(--sub);margin-bottom:14px;}
.vip-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.btn-vip-remove{background:rgba(220,38,38,0.08);color:var(--red);border:1px solid rgba(220,38,38,0.15);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;}
.btn-vip-give{background:rgba(184,137,42,0.1);color:var(--gold);border:1px solid rgba(184,137,42,0.2);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-box{background:var(--card);border-radius:20px;padding:32px;width:100%;max-width:400px;box-shadow:0 24px 60px rgba(0,0,0,0.3);border:1px solid var(--br);}
.modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:4px;}
.modal-sub{font-size:13px;color:var(--sub);margin-bottom:20px;}
.vip-days-row{display:flex;gap:8px;margin-bottom:12px;}
.day-btn{flex:1;background:var(--input);border:1.5px solid var(--br);border-radius:9px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--text);cursor:pointer;transition:.2s;}
.day-btn.active{background:var(--navy);color:white;border-color:var(--navy);}
.day-input{width:100%;background:var(--input);border:1.5px solid var(--br);border-radius:9px;padding:10px 14px;font-family:'Inter',sans-serif;font-size:13px;outline:none;margin-bottom:20px;color:var(--text);}
.day-input:focus{border-color:var(--nl);}
.note-textarea{width:100%;background:var(--input);border:1.5px solid var(--br);border-radius:9px;padding:12px 14px;font-family:'Inter',sans-serif;font-size:13px;outline:none;resize:none;margin-bottom:20px;color:var(--text);}
.note-textarea:focus{border-color:var(--nl);}
.modal-footer{display:flex;gap:10px;justify-content:flex-end;}
.modal-cancel{background:var(--input);border:1.5px solid var(--br);border-radius:9px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:var(--sub);cursor:pointer;}
.modal-confirm{background:var(--navy);color:white;border:none;border-radius:9px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;}

.toast{position:fixed;bottom:24px;right:24px;background:var(--navy);color:white;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;z-index:400;box-shadow:0 8px 24px rgba(0,0,0,0.3);}

@media(max-width:1100px){.stats-row{grid-template-columns:repeat(2,1fr)}.vip-cards{grid-template-columns:1fr 1fr}}
@media(max-width:768px){.sidebar{display:none}.stats-row{grid-template-columns:1fr 1fr}.main-content{padding:16px}}
@media(max-width:500px){.stats-row{grid-template-columns:1fr}.vip-cards{grid-template-columns:1fr}}
`
