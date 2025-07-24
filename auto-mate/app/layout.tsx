"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { TranslationProvider } from "@/i18n/TranslationContext";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { cookies } from "next/headers";
import { I18nextProvider } from 'react-i18next';
import { initializeI18n } from "@/lib/i18n"
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "wps工具箱",
//   description: "ppt到pdf高清转换",
// };

export default function RootLayout({
  children,
  params = { lang: 'en' }, // 默认值
}: Readonly<{
  children: React.ReactNode;
  params?: { lang?: string }; // 可选参数
}>) {

  return (
    <html lang={params?.lang || 'en'} suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <I18nextProvider i18n={initializeI18n(params?.lang || 'en')}>

          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            {children}
            <Toaster />
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}