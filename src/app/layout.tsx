import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: 'GiftMeme - Bundle, Buy & Gift Memecoins',
  description: 'The ultimate platform for memecoin enthusiasts to bundle, buy, and gift their favorite tokens',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const cookies = headersList ? headersList.get('cookie') : null

  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-off-white`}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}
