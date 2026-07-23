"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Menu,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Volume2,
  X,
} from "lucide-react"
import { useCart } from "@/components/cart-context"
import { HoodieSvg } from "@/components/hoodie-svg"
import { Logo } from "@/components/logo"
import { scrollToId } from "@/components/smooth-scroll"
import { products, SIZES, type Product } from "@/lib/products"

const dropCopy: Record<
  string,
  { line: string; telugu: string; ink: string; badge: string; edition: string }
> = {
  "gt-baavundi": {
    line: "BAAVUNDI.",
    telugu: "బావుంది.",
    ink: "#f5cb45",
    badge: "Boss approved",
    edition: "01 / 100",
  },
  "gt-manakenduku": {
    line: "MANAKENDUKU?",
    telugu: "మనకెందుకు?",
    ink: "#f3ead9",
    badge: "Peace department",
    edition: "02 / 100",
  },
  "gt-anthega": {
    line: "ANTHE GA.",
    telugu: "అంతే గా.",
    ink: "#d83a2e",
    badge: "Logic final",
    edition: "03 / 100",
  },
  "gt-ayyayyo": {
    line: "AYYAYYO.",
    telugu: "అయ్యయ్యో.",
    ink: "#11100d",
    badge: "Instant reaction",
    edition: "04 / 100",
  },
}

const paper = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: (index * 37) % 97,
  delay: (index % 7) * 0.08,
  rotate: (index * 53) % 180,
  drift: (index % 2 === 0 ? 1 : -1) * (25 + (index % 5) * 14),
}))

const marquee = [
  "480 GSM",
  "MADE IN HYDERABAD",
  "LIMITED DROP",
  "FREE SHIPPING ₹2,999+",
  "NO BORING PRINTS",
  "FULL THEATRE ENERGY",
]

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={() => scrollToId("#top")}
      aria-label="G Theta home"
      className="group flex items-center gap-2 text-left"
    >
      <Logo className={compact ? "h-8 w-12" : "h-10 w-16"} />
      <span className="leading-none">
        <span className="block font-display text-sm font-black uppercase tracking-[0.18em]">
          G Theta
        </span>
        <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-foreground/55">
          Meme material
        </span>
      </span>
    </button>
  )
}

function SiteNav() {
  const { totalCount, openCart } = useCart()
  const [open, setOpen] = useState(false)
  const links = [
    ["#drop", "Drop 01"],
    ["#lookbook", "Lookbook"],
    ["#memes", "Meme hall"],
    ["#quality", "Quality"],
  ] as const

  const go = (href: string) => {
    setOpen(false)
    scrollToId(href)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0906]/88 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <BrandLockup compact />

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([href, label]) => (
            <button
              key={href}
              onClick={() => go(href)}
              className="nav-link text-xs font-black uppercase tracking-[0.18em] text-foreground/65 transition hover:text-[#f5cb45]"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            id="nav-cart"
            onClick={openCart}
            className="group relative flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#f5cb45] hover:bg-[#f5cb45] hover:text-black"
          >
            <ShoppingBag size={16} strokeWidth={2.4} />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d83a2e] px-1 text-[10px] text-white group-hover:bg-black">
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0906]"
          >
            <div className="grid px-5 py-4">
              {links.map(([href, label], index) => (
                <button
                  key={href}
                  onClick={() => go(href)}
                  className="flex items-center justify-between border-b border-white/10 py-4 text-left font-display text-2xl font-black uppercase"
                >
                  <span>
                    <span className="mr-3 text-xs text-[#f5cb45]">0{index + 1}</span>
                    {label}
                  </span>
                  <ArrowUpRight size={19} />
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function WhistleButton() {
  const [burst, setBurst] = useState(0)

  const whistle = () => {
    setBurst((value) => value + 1)
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const context = new AudioCtx()
      const gain = context.createGain()
      const oscillator = context.createOscillator()
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1240, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1960, context.currentTime + 0.16)
      oscillator.frequency.exponentialRampToValueAtTime(1510, context.currentTime + 0.42)
      gain.gain.setValueAtTime(0.0001, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.52)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.54)
      window.setTimeout(() => void context.close(), 700)
    } catch {}
  }

  return (
    <>
      <button
        onClick={whistle}
        className="group relative flex items-center gap-3 rounded-full bg-[#f5cb45] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-1 hover:bg-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[#f5cb45] transition group-hover:rotate-12">
          <Volume2 size={16} fill="currentColor" />
        </span>
        Whistle podu
      </button>
      <AnimatePresence>
        {burst > 0 && (
          <motion.div
            key={burst}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {paper.map((piece) => (
              <motion.span
                key={piece.id}
                className="absolute bottom-[8%] h-5 w-3 bg-[#f7f0df] shadow-lg"
                style={{ left: `${piece.left}%` }}
                initial={{ y: 0, rotate: 0, opacity: 0 }}
                animate={{
                  x: piece.drift,
                  y: [0, -300 - (piece.id % 4) * 65, -210],
                  rotate: piece.rotate + 540,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.8, delay: piece.delay, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-black pt-[72px]">
      <Image
        src="/images/hero-theatre.webp"
        alt="A cinematic parody hero entry into a cheering single-screen theatre crowd"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,5,3,.94)_0%,rgba(6,5,3,.68)_32%,rgba(6,5,3,.08)_65%),linear-gradient(0deg,rgba(6,5,3,.95)_0%,transparent_43%)]" />
      <div className="hero-vignette absolute inset-0" />
      <div className="absolute left-4 top-24 z-10 hidden rotate-[-7deg] border-2 border-[#f5cb45] px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#f5cb45] md:block">
        Parody visual
        <br />
        front bench cut
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-[1600px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 sm:pt-12 lg:px-14 lg:pb-10 lg:pt-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#f5cb45]"
          >
            <span className="h-px w-10 bg-[#f5cb45]" />
            Hyderabad · Drop 01 · 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-[48rem] font-display text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.72] tracking-[-0.065em]"
          >
            Meme
            <span className="hero-stroke block">Material.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7 max-w-xl border-l-4 border-[#d83a2e] pl-4"
          >
            <p className="font-telugu text-xl font-black leading-tight sm:text-2xl">
              మీ రియాక్షన్. మీ హూడీ.
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/65 sm:text-base">
              Telugu internet culture, cut in heavyweight cotton. Built for the first-day,
              first-show person in you.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("#drop")}
              className="flex items-center gap-3 rounded-full bg-[#d83a2e] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:bg-white hover:text-black"
            >
              Shop the drop <ArrowDown size={17} />
            </button>
            <WhistleButton />
          </div>
          <div className="max-w-xs text-left sm:text-right">
            <div className="mb-2 flex items-center gap-1 sm:justify-end">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={13} className="fill-[#f5cb45] text-[#f5cb45]" />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Crowd rating: paperlu egiripoyayi
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TheatreMarquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="overflow-hidden border-y border-black bg-[#f5cb45] py-3 text-black">
      <div className="marquee-track gap-8">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-display text-lg font-black uppercase tracking-[0.08em]">{item}</span>
            <Ticket size={19} fill="currentColor" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const [size, setSize] = useState("L")
  const copy = dropCopy[product.id]

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.08 }}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11100d]"
    >
      <div className="relative aspect-[4/4.7] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.14),transparent_52%)]">
        <span className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
          {copy.badge}
        </span>
        <span className="absolute right-5 top-5 z-10 font-mono text-[10px] text-white/45">
          {copy.edition}
        </span>
        <motion.div
          className="absolute inset-x-[14%] bottom-[5%] top-[8%]"
          whileHover={{ scale: 1.04, rotate: index % 2 ? 1.2 : -1.2 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <HoodieSvg
            colorFrom={product.colorFrom}
            colorTo={product.colorTo}
            className="h-full w-full drop-shadow-[0_28px_28px_rgba(0,0,0,.45)]"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] w-[40%] -translate-x-1/2 -rotate-2 text-center"
            style={{ color: copy.ink }}
          >
            <p className="font-display text-[clamp(.8rem,2.2vw,1.65rem)] font-black uppercase leading-none tracking-[-0.04em]">
              {copy.line}
            </p>
            <p className="font-telugu mt-1 text-[clamp(.55rem,1.2vw,.9rem)] font-black">
              {copy.telugu}
            </p>
          </div>
        </motion.div>
        <span className="absolute bottom-5 left-5 rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-black">
          480 GSM
        </span>
      </div>

      <div className="border-t border-white/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#f5cb45]">
              {product.code}
            </p>
            <h3 className="mt-1 font-display text-2xl font-black uppercase">{product.name}</h3>
          </div>
          <p className="font-display text-xl font-black">₹{product.price.toLocaleString("en-IN")}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {SIZES.map((item) => (
            <button
              key={item}
              onClick={() => setSize(item)}
              aria-label={`Select size ${item}`}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[10px] font-black transition ${
                size === item
                  ? "border-[#f5cb45] bg-[#f5cb45] text-black"
                  : "border-white/15 text-white/55 hover:border-white/50 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => addItem(product, size)}
          className="mt-5 flex w-full items-center justify-between rounded-full border border-white/15 px-5 py-3.5 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#d83a2e] hover:bg-[#d83a2e]"
        >
          Add to bag
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            <ArrowUpRight size={15} />
          </span>
        </button>
      </div>
    </motion.article>
  )
}

function DropSection() {
  return (
    <section id="drop" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div>
            <p className="eyebrow">Now playing · Drop 01</p>
            <h2 className="mt-4 max-w-5xl font-display text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[-0.055em]">
              Four moods.
              <span className="block text-[#d83a2e]">Zero context.</span>
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-white/55 lg:justify-self-end">
            Not screenshots pasted on cloth. Each line is rebuilt as wearable typography, screen
            printed on dense 480 GSM brushed cotton with an oversized Hyderabad fit.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Lookbook() {
  return (
    <section id="lookbook" className="scroll-mt-16 px-3 py-10 sm:px-6">
      <div className="relative mx-auto min-h-[74svh] max-w-[1580px] overflow-hidden rounded-[2rem] border border-white/10">
        <Image
          src="/images/lookbook.webp"
          alt="Four South Indian models in red, cream, black, and yellow oversized hoodies"
          fill
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 z-10 grid gap-6 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <p className="eyebrow">Front bench uniform</p>
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.055em]">
              Outside silent.
              <span className="block text-[#f5cb45]">Inside theatre.</span>
            </h2>
          </div>
          <div className="max-w-sm rounded-2xl border border-white/15 bg-black/65 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[#f5cb45]">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.22em]">The fit</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Drop shoulder. Boxy torso. Heavy rib. Soft inside. Built to survive interval samosas,
              late-night rides and unsolicited movie reviews.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChiruApproval() {
  return (
    <section id="memes" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#f1e8d6] text-[#11100d] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative min-h-[560px] lg:min-h-[760px]"
        >
          <Image
            src="/images/chiru-approval.webp"
            alt="A satirical editorial portrait of Chiranjeevi giving a warm approving reaction"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-black/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
            Original parody portrait
          </span>
        </motion.div>

        <div className="relative flex flex-col justify-between overflow-hidden p-7 sm:p-12 lg:p-16">
          <span className="absolute -right-10 -top-16 font-display text-[16rem] font-black leading-none text-[#d83a2e]/10">
            “
          </span>
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d83a2e]">
              Boss verdict · Approved
            </p>
            <h2 className="mt-8 font-display text-[clamp(3.35rem,11vw,11rem)] font-black uppercase leading-[0.7] tracking-[-0.07em]">
              Baavundi.
            </h2>
            <p className="font-telugu mt-6 text-[clamp(2.1rem,5vw,4.8rem)] font-black leading-none text-[#d83a2e]">
              బావుంది.
            </p>
          </div>
          <div className="relative mt-20 border-t-2 border-black pt-6">
            <p className="max-w-xl text-xl font-bold leading-8">
              The only review our design team needed. Warm nod. Tiny smile. Hoodie goes directly to
              production.
            </p>
            <button
              onClick={() => scrollToId("#drop")}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#d83a2e]"
            >
              Wear the verdict <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function MemeHall() {
  const reactions = [
    { name: "Side eye", use: "When the trailer says “pan-world”", color: "#929d52" },
    { name: "Full happy", use: "When interval block actually lands", color: "#f5cb45" },
    { name: "Manakenduku", use: "When the group chat starts fan wars", color: "#d83a2e" },
  ]
  return (
    <section className="border-y border-white/10 bg-[#11100d] py-24 lg:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">The reaction archive</p>
            <h2 className="mt-3 font-display text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.055em]">
              Meme hall
              <span className="text-[#f5cb45]"> of fame.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/55">
            Three expressions. Roughly ninety percent of Telugu group-chat communication.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
          <Image
            src="/images/meme-legends.webp"
            alt="A three-panel tribute to iconic Telugu comedy reaction faces"
            width={3072}
            height={1024}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {reactions.map((reaction, index) => (
            <motion.div
              key={reaction.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black"
                  style={{ backgroundColor: reaction.color }}
                >
                  0{index + 1}
                </span>
                <Play size={14} fill="currentColor" className="text-white/30" />
              </div>
              <h3 className="mt-7 font-display text-3xl font-black uppercase">{reaction.name}</h3>
              <p className="mt-2 text-sm text-white/50">{reaction.use}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Quality() {
  const details = [
    ["480", "GSM brushed loopback"],
    ["02", "Screen-print passes"],
    ["30", "Day easy returns"],
    ["100", "Pieces per design"],
  ]
  const checks = [
    "Pre-shrunk heavyweight cotton",
    "Oversized unisex Hyderabad fit",
    "High-density water-based ink",
    "Recyclable plastic-free mailer",
  ]
  return (
    <section id="quality" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">No cheap fan merch</p>
            <h2 className="mt-4 font-display text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.76] tracking-[-0.06em]">
              Joke soft.
              <span className="block text-[#f5cb45]">Hoodie hard.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
              The meme gets the laugh. The garment earns the repeat wear. Every drop is sampled,
              washed, stretched and reworked before it reaches the front bench.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div
                  key={check}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d83a2e]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {check}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            {details.map(([number, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="min-h-64 bg-[#0a0906] p-7 sm:min-h-80"
              >
                <p className="font-display text-[clamp(5rem,10vw,10rem)] font-black leading-none tracking-[-0.08em] text-[#f5cb45]">
                  {number}
                </p>
                <p className="mt-6 max-w-[10rem] text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const [email, setEmail] = useState("")
  const { notify } = useCart()
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="overflow-hidden border-t border-white/10 bg-[#d83a2e] text-white">
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:px-12 lg:py-24">
        <div>
          <BrandLockup />
          <h2 className="mt-10 max-w-4xl font-display text-[clamp(3.8rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.06em]">
            Next drop?
            <span className="block text-[#f5cb45]">First show meeke.</span>
          </h2>
        </div>
        <form
          className="self-end"
          onSubmit={(event) => {
            event.preventDefault()
            notify("List lo padipoyav! First-show update direct ga vastundi 🎟️")
            setEmail("")
          }}
        >
          <label htmlFor="drop-email" className="text-xs font-black uppercase tracking-[0.2em]">
            Join the fan club
          </label>
          <div className="mt-4 flex border-b-2 border-white">
            <input
              id="drop-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nee@email.com"
              className="min-w-0 flex-1 bg-transparent py-4 text-xl font-bold outline-none placeholder:text-white/45"
            />
            <button aria-label="Subscribe" className="px-4 transition hover:text-[#f5cb45]">
              <ArrowUpRight size={28} />
            </button>
          </div>
          <p className="mt-3 text-xs text-white/65">Drop alerts only. Spam chesthe theatre bayata kaluddam.</p>
        </form>
      </div>

      <div className="border-t border-white/20 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} G Theta · Hyderabad, India</p>
          <p>Demo storefront · Parody visuals · No real payment processed</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap font-display text-[21vw] font-black uppercase leading-[0.67] tracking-[-0.08em] text-[#f5cb45]">
        G THETA
      </div>
    </footer>
  )
}

export function TeluguStorefront() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <TheatreMarquee />
        <DropSection />
        <Lookbook />
        <ChiruApproval />
        <MemeHall />
        <Quality />
      </main>
      <Footer />
    </>
  )
}
