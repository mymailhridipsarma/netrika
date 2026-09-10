import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Netrika — See what the AI sees',
  description: 'Explainable AI for diabetic retinopathy screening and clinical decision support.',
  generator: 'v0.app',
  icons: {
    icon: '/logo-netrika.png',
    apple: '/logo-netrika.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#07111F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`bg-[#07111F] ${jakarta.variable}`}>
      <body className={`${jakarta.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
