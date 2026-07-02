import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "MiniGest - Gestão Simples para o Seu Negócio",
  description: "Sistema simples e leve de gestão para pequenos negócios",
  manifest: "/manifest",
  icons: { icon: "/icons/icon-192.svg" },
  appleWebApp: {
    capable: true,
    title: "MiniGest",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0284c7",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0284c7",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
