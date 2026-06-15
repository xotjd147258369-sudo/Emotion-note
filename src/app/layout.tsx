import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { PWARegister } from "@/components/pwa/register"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "감정 노트",
    template: "%s | 감정 노트",
  },
  description: "감정 일기, 감사노트, 동기부여 문장 카드를 기록하는 웹앱",
  applicationName: "감정 노트",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "감정 노트",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-192.svg", sizes: "192x192" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7f2",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <PWARegister />
      </body>
    </html>
  )
}
