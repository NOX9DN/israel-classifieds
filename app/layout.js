import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Израил.ру — Авто, жильё и работа",
  description: "Объявления для русскоязычного сообщества Израиля",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" dir="ltr">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}