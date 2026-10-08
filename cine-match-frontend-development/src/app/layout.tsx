import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'

import { Providers } from '@/components/providers'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: {
    default: 'CineMatch: Discover Movies You’ll Love',
    template: '%s | CineMatch',
  },

  description:
    'CineMatch is a smart movie discovery platform. Explore thousands of movies and get recommendations based on what you love.',

  icons: {
    icon: '/cinematch-icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0b0d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark ${inter.variable} ${barlow.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans antialiased">
        <Providers>{children}</Providers>

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}