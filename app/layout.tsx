import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Open_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Netrika — See what the AI sees',
  description: 'Explainable AI for diabetic retinopathy screening and clinical decision support.',
  generator: 'v0.app',
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0da487',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${openSans.variable} ${jetbrainsMono.variable}`}>
      <body className={`${openSans.className} font-sans antialiased bg-[#fcfdfd] text-slate-900 selection:bg-[#e6f8f3] selection:text-[#0da487]`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}



