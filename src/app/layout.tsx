import type { Metadata } from "next";
import { Varela } from "next/font/google";
import "./globals.css";

const varela = Varela({
  weight: "400",
  subsets: ["latin"],
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
    <html lang="az" className={varela.className}>
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
