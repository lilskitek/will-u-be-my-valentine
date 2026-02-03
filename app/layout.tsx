import type { Metadata, Viewport } from 'next'
import { translations } from '@/constants/translations'
import './globals.css'

export const metadata: Metadata = {
  title: translations.metadata.title,
  description: translations.metadata.description,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
