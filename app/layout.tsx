import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calculator Hub",
  description: "A collection of useful calculators for various purposes",
    generator: 'KRISH'
    
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0BCTTH4GWL"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0BCTTH4GWL');
            `,
          }}
        />
         <meta name="google-adsense-account" content="ca-pub-5670862530868386"/> 
        <meta name="google-site-verification" content="ad-qcNq_GrrumhwGtiGccvsvrFy2TsdRtVJyqWBiKZk" />
        <link rel="shortcut icon" href="calculator.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col md:flex-row">
            <AppSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
