import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://smart-parking-management-system.vercel.app'),
  title: {
    default: 'ParkCore | ARM Cortex-M3 Parking Simulator',
    template: '%s | ParkCore',
  },
  description:
    'Interactive ARM Cortex-M3 (LPC1768) smart parking simulator — 32-slot state machine, live debug dashboard, flag monitor, and Keil uVision C source viewer.',
  applicationName: 'ParkCore',
  keywords: ['ARM', 'Cortex-M3', 'LPC1768', 'Keil uVision', 'embedded', 'state machine', 'parking', 'simulator'],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'ParkCore | ARM Cortex-M3 Parking Simulator',
    description: 'Live state machine + slot-grid simulator for an LPC1768 parking system — watch flags, fee calc, and bubble sort run in real time.',
    type: 'website',
    images: [{ url: '/banner.png', width: 1600, height: 400, alt: 'ParkCore banner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParkCore | ARM Cortex-M3 Parking Simulator',
    description: 'Live state machine + slot-grid simulator for an LPC1768 parking system.',
    images: ['/banner.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#06b6d4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
