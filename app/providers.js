'use client'

import { LangProvider } from "@/lib/useLang";

export default function Providers({ children }) {
  return (
    <LangProvider>
      {children}
    </LangProvider>
  );
}
