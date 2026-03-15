'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/useLang'

const PLANS = [
  {
    id: 'vip_3',
    days: 3,
    price: 29,
    label: '3 дня',
    desc: 'Попробовать',
    features: ['Объявление в топе', 'Выделение в списке', 'Бейдж ⭐ VIP'],
    popular: false,
  },
  {
    id: 'vip_7',
    days: 7,
    price: 49,
    label: '7 дней',
    desc: 'Самый популярный',
    features: ['Объявление в топе', 'Выделение в списке', 'Бейдж ⭐ VIP', 'Приоритет в поиске'],
    popular: true,
  },
  {
    id: 'vip_14',
    days: 14,
    price: 79,
    label: '14 дней',
    desc: 'Выгодно',
    features: ['Объявление в топе', 'Выделение в списке', 'Бейдж ⭐ VIP', 'Приоритет в поиске', 'До 10 фото'],
    popular: false,
  },
  {
    id: 'vip_30',
    days: 30,
    price: 129,
    label: '30 дней',
    desc: 'Максимум',
    features: ['Объявление в топе', 'Выделение в списке', 'Бейдж ⭐ VIP', 'Приоритет в поиске', 'До 10 фото', 'Персональный менеджер'],
    popular: false,
  },
]

export default function VipPage() {
  const { lang, switchLang } = useLang()
  const [selected, setSelected] = useState('vip_7')
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handlePay(plan) {
    // TODO: подключить платёжный шлюз
    // Stripe: window.location.href = '/api/vip/checkout?plan=' + plan.id
    // Cardcom: аналогично
    showToast('💳 Платёжный шлюз скоро будет подключён')
  }

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
          <button className="btn-login">Войти</button>
          <Link href="/" className="btn-back">← На сайт</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="vip-hero">
        <div className="vip-hero-inner">
          <div className="vip-tag">⭐ VIP размещение</div>
          <h1 className="vip-title">Продайте быстрее —<br/><em>будьте первыми</em></h1>
          <p className="vip-sub">VIP объявления получают в 5 раз больше просмотров и продаются в 3 раза быстрее</p>
        </div>
      </div>

      {/* PLANS */}
      <div className="plans-wrap">

        <div className="plans-grid">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`plan-card${plan.popular?' popular':''}${selected===plan.id?' selected':''}`}
              onClick={() => setSelected(plan.id)}
            >
              {plan.popular && <div className="popular-badge">Популярный</div>}
              <div className="plan-days">{plan.label}</div>
              <div className="plan-desc">{plan.desc}</div>
              <div className="plan-price">
                <span className="plan-currency">₪</span>
                <span className="plan-num">{plan.price}</span>
              </div>
              <div className="plan-per">за размещение</div>
              <div className="plan-features">
                {plan.features.map(f => (
                  <div key={f} className="plan-feature">
                    <span className="feature-check">✓</span> {f}
                  </div>
                ))}
              </div>
              <button
                className={`plan-btn${plan.popular?' plan-btn-primary':''}`}
                onClick={e => { e.stopPropagation(); handlePay(plan) }}
              >
                Выбрать {plan.label}
              </button>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="how-section">
          <h2 className="how-title">Как это работает</h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="step-num">1</div>
              <div className="step-text">Выбери тариф и оплати</div>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-num">2</div>
              <div className="step-text">VIP статус активируется автоматически</div>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-num">3</div>
              <div className="step-text">Твоё объявление в топе списка</div>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-num">4</div>
              <div className="step-text">По истечении срока — автоматически отключается</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2 className="how-title">Вопросы</h2>
          <div className="faq-list">
            {[
              { q:'Когда активируется VIP?',            a:'Сразу после оплаты — автоматически, без ожидания.' },
              { q:'Что будет когда срок истечёт?',       a:'VIP отключится автоматически. Объявление останется активным, просто без VIP статуса.' },
              { q:'Можно продлить?',                     a:'Да, в любой момент — просто оплати ещё раз.' },
              { q:'Как платить?',                        a:'Банковская карта, Bit, Apple Pay. Скоро доступно.' },
            ].map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">❓ {item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

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

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
:root{--cream:#F8F6F0;--cream2:#F0EDE4;--navy:#1B2D6B;--navy-mid:#2C45A0;--navy-lt:#4A6FD4;--navy-dim:rgba(27,45,107,0.07);--gold:#B8892A;--text:#1A1A2E;--muted:#8A8AA8;--border:rgba(27,45,107,0.1);}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:var(--cream);color:var(--text);}

nav{position:sticky;top:0;z-index:200;height:68px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(248,246,240,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.logo{font-family:'Playfair Display',serif;font-weight:900;font-size:23px;color:var(--navy);text-decoration:none;letter-spacing:-0.3px;}
.logo span{color:var(--navy-mid);}
.nav-right{display:flex;align-items:center;gap:8px;}
.lang-switch{display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;}
.lang-btn{background:transparent;border:none;padding:6px 12px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;}
.lang-btn.active{background:var(--navy);color:white;}
.btn-login{background:transparent;color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:9px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}
.btn-back{color:var(--muted);text-decoration:none;font-size:13px;font-weight:500;padding:9px 14px;}

.vip-hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);padding:60px 32px 52px;text-align:center;}
.vip-hero-inner{max-width:600px;margin:0 auto;}
.vip-tag{display:inline-block;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.85);font-size:12px;font-weight:700;padding:5px 16px;border-radius:20px;margin-bottom:20px;letter-spacing:0.5px;}
.vip-title{font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,48px);font-weight:900;color:white;line-height:1.1;margin-bottom:14px;letter-spacing:-1px;}
.vip-title em{font-style:italic;color:#93C5FD;}
.vip-sub{font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;}

.plans-wrap{max-width:1100px;margin:0 auto;padding:48px 32px 64px;}

.plans-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:56px;}

.plan-card{background:white;border:2px solid var(--border);border-radius:20px;padding:28px 22px;cursor:pointer;transition:all .25s;position:relative;text-align:center;}
.plan-card:hover{border-color:var(--navy-lt);transform:translateY(-3px);box-shadow:0 12px 32px rgba(27,45,107,0.1);}
.plan-card.selected{border-color:var(--navy);box-shadow:0 0 0 4px rgba(27,45,107,0.08);}
.plan-card.popular{border-color:var(--gold);}
.plan-card.popular.selected{border-color:var(--gold);box-shadow:0 0 0 4px rgba(184,137,42,0.1);}

.popular-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:white;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;white-space:nowrap;}

.plan-days{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:4px;}
.plan-desc{font-size:12px;color:var(--muted);margin-bottom:20px;}
.plan-price{display:flex;align-items:flex-start;justify-content:center;gap:2px;margin-bottom:4px;}
.plan-currency{font-size:18px;font-weight:700;color:var(--navy);margin-top:6px;}
.plan-num{font-family:'Playfair Display',serif;font-size:48px;font-weight:900;color:var(--navy);line-height:1;}
.plan-per{font-size:11px;color:var(--muted);margin-bottom:20px;}

.plan-features{text-align:left;margin-bottom:24px;}
.plan-feature{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text);padding:5px 0;border-bottom:1px solid var(--border);}
.plan-feature:last-child{border-bottom:none;}
.feature-check{color:var(--navy);font-weight:700;flex-shrink:0;}

.plan-btn{width:100%;background:var(--navy-dim);color:var(--navy);border:1.5px solid var(--border);border-radius:10px;padding:12px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;}
.plan-btn:hover{background:var(--navy);color:white;border-color:var(--navy);}
.plan-btn-primary{background:var(--gold);color:white;border-color:var(--gold);}
.plan-btn-primary:hover{background:#a07020;border-color:#a07020;}

.how-section{background:white;border:1.5px solid var(--border);border-radius:20px;padding:36px;margin-bottom:24px;}
.how-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:28px;text-align:center;}
.how-steps{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;}
.how-step{text-align:center;flex:1;min-width:140px;}
.step-num{width:40px;height:40px;border-radius:50%;background:var(--navy);color:white;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;}
.step-text{font-size:13px;color:var(--text);line-height:1.4;}
.how-arrow{font-size:20px;color:var(--muted);flex-shrink:0;}

.faq-section{background:white;border:1.5px solid var(--border);border-radius:20px;padding:36px;}
.faq-list{display:flex;flex-direction:column;gap:0;}
.faq-item{padding:16px 0;border-bottom:1px solid var(--border);}
.faq-item:last-child{border-bottom:none;}
.faq-q{font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;}
.faq-a{font-size:13px;color:var(--muted);line-height:1.6;}

footer{background:var(--navy);}
.footer-bottom{max-width:1100px;margin:0 auto;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:rgba(255,255,255,0.3);}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;}

.toast{position:fixed;bottom:24px;right:24px;background:var(--navy);color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:600;z-index:400;}

@media(max-width:900px){.plans-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.plans-grid{grid-template-columns:1fr}.how-steps{flex-direction:column}.how-arrow{transform:rotate(90deg)}.plans-wrap{padding:24px 16px}.nav{padding:0 16px}}
`
