import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'GiftMeme - Bundle, Buy & Gift Memecoins',
  description: 'The ultimate platform for memecoin enthusiasts to bundle, buy, and gift their favorite tokens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    {/* <html lang="en" className="dark"> */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-off-white`}>
        {children}
      </body>
    </html>
  )
}
