import type { Metadata } from "next"
import { Archivo_Black, Noto_Sans_Telugu, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { ClickSpark } from "@/components/fx/click-spark"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutOverlay } from "@/components/checkout-overlay"
import { MemeToaster } from "@/components/meme-toaster"
import { ScrollProgress } from "@/components/scroll-progress"
import { SmoothScroll } from "@/components/smooth-scroll"

const display = Archivo_Black({ subsets: ["latin"], variable: "--font-display-face", weight: "400" })
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" })
const telugu = Noto_Sans_Telugu({ subsets: ["telugu"], variable: "--font-telugu-face" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://g-theta-rho.vercel.app"),
  title: "G THETA — Telugu Meme Material",
  description:
    "Heavyweight Telugu meme hoodies from Hyderabad. Limited drops, first-show energy, zero boring prints.",
  openGraph: {
    title: "G THETA — Telugu Meme Material",
    description: "Your reaction. Your hoodie. Limited Telugu meme streetwear drops.",
    images: ["/images/hero-theatre.webp"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${grotesk.variable} ${telugu.variable}`}>
      <body>
        <div className="grain" />
        <CartProvider>
          <SmoothScroll>
            <ScrollProgress />
            {children}
            <CartDrawer />
            <MemeToaster />
            <CheckoutOverlay />
            <ClickSpark
              sparkColor="#f5cb45"
              sparkSize={18}
              sparkRadius={18}
              sparkCount={8}
              duration={420}
              easing="ease-out"
              extraScale={1}
            />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  )
}
