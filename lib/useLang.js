'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import translations from './translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ru')

  // Persist language choice
  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'ru' || saved === 'he') setLang(saved)
  }, [])

  const switchLang = (l) => {
    setLang(l)
    localStorage.setItem('lang', l)
    // Set RTL/LTR on document
    document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  // t('key') — returns translated string
  const t = (key) => translations[lang]?.[key] || key

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
