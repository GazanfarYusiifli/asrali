import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bebasNeue = localFont({
  src: "../../public/fonts/bebas/BebasNeue-Regular.ttf",
  variable: "--font-bebas",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asrali.com - Super App",
  description: "Bütün sektorlar üçün ERP sistemi",
  icons: {
    icon: '/logo.png',
  },
};

import { AuthProvider } from "./context/AuthContext";
import { I18nProvider } from "./context/I18nContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={bebasNeue.className}>
      <body>
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
