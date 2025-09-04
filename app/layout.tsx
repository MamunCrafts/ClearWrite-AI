import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import PostHogClient from '@/components/posthog-client'

export const metadata: Metadata = {
  title: 'ClearWriteAI - AI-Powered Writing Assistant by MamunCrafts',
  description: 'Projects and creations by Md. Al Mamun Mim — blending code, design, and AI.',
  generator: 'Next.js',
  authors: [{ name: 'Md. Al Mamun Mim', url: 'https://github.com/MamunCrafts' }],
  keywords: ['MamunCrafts', 'AI Projects', 'Next.js', 'Fullstack Development', 'Md. Al Mamun Mim'],
  themeColor: '#ffffff',
  colorScheme: 'light',
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'ClearWriteAI - AI-Powered Writing Assistant',
    description: 'Blending code, design, and AI to create innovative projects.',
    url: 'https://clearwriteai.example.com',
    siteName: 'ClearWriteAI',
    images: [
      {
        url: 'https://clearwriteai.example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClearWriteAI Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearWriteAI - AI-Powered Writing Assistant',
    description: 'Blending code, design, and AI to create innovative projects.',
    creator: '@MamunCrafts',
    images: ['https://clearwriteai.example.com/twitter-image.png'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <PostHogClient />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
