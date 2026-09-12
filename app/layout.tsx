import type { Metadata } from "next"
import { Archivo_Black, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutOverlay } from "@/components/checkout-overlay"
import { MemeToaster } from "@/components/meme-toaster"

const display = Archivo_Black({ subsets: ["latin"], variable: "--font-display-face", weight: "400" })
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" })

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
    <html lang="en" className={`${display.variable} ${grotesk.variable}`}>
      <body>
        <CartProvider>
            {children}
            <CartDrawer />
            <MemeToaster />
            <CheckoutOverlay />
        </CartProvider>
      </body>
    </html>
  )
}
