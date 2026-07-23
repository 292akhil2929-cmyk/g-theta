"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Menu,
  Music2,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react"
import { useCart } from "@/components/cart-context"
import { HoodieSvg } from "@/components/hoodie-svg"
import { Logo } from "@/components/logo"
import { scrollToId } from "@/components/smooth-scroll"
import { products, SIZES, type Product } from "@/lib/products"

const dropCopy: Record<
  string,
  { line: string; ink: string; badge: string; edition: string }
> = {
  "gt-baavundi": {
    line: "BAAVUNDI.",
    ink: "#f5cb45",
    badge: "Boss approved",
    edition: "01 / 100",
  },
  "gt-manakenduku": {
    line: "MANAKENDUKU?",
    ink: "#f3ead9",
    badge: "Peace department",
    edition: "02 / 100",
  },
  "gt-anthega": {
    line: "ANTHE GA.",
    ink: "#d83a2e",
    badge: "Logic final",
    edition: "03 / 100",
  },
  "gt-ayyayyo": {
    line: "AYYAYYO.",
    ink: "#11100d",
    badge: "Instant reaction",
    edition: "04 / 100",
  },
}

const paper = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: (index * 37) % 97,
  top: (index * 61) % 93,
  delay: (index % 8) * 0.08,
  rotate: (index * 53) % 180,
  drift: (index % 2 === 0 ? 1 : -1) * (25 + (index % 5) * 14),
  color: ["#d83a2e", "#f5cb45", "#ff3e91", "#1667ff", "#78d63d"][index % 5],
}))

const heroPaper = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  left: (index * 43) % 101,
  delay: (index % 17) * 0.19,
  duration: 2.8 + (index % 8) * 0.36,
  drift: (index % 2 ? 1 : -1) * (35 + (index % 7) * 17),
  rotate: (index * 71) % 240,
  size: 8 + (index % 4) * 4,
  color: ["#d83a2e", "#f5cb45", "#1667ff", "#ff3e91"][index % 4],
}))

const marquee = [
  "480 GSM",
  "MADE IN HYDERABAD",
  "LIMITED DROP",
  "FREE SHIPPING ₹2,999+",
  "NO BORING PRINTS",
  "FULL THEATRE ENERGY",
]

function emitSound(name: "laugh" | "sting" | "cheer" | "whoosh") {
  window.dispatchEvent(new CustomEvent("gtheta-sound", { detail: name }))
}

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
        <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-current opacity-55">
          Meme material
        </span>
      </span>
    </button>
  )
}

function ScrollFunLayer() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 22, mass: 0.35 })
  const paperY = useTransform(scrollYProgress, [0, 1], ["-12vh", "115vh"])
  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)
  const glowX = useSpring(mouseX, { stiffness: 90, damping: 22 })
  const glowY = useSpring(mouseY, { stiffness: 90, damping: 22 })

  useEffect(() => {
    const follow = (event: PointerEvent) => {
      mouseX.set(event.clientX - 180)
      mouseY.set(event.clientY - 180)
    }
    window.addEventListener("pointermove", follow, { passive: true })
    return () => window.removeEventListener("pointermove", follow)
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[42] hidden h-[360px] w-[360px] rounded-full bg-[#f5cb45]/10 blur-[90px] lg:block"
        style={{ x: glowX, y: glowY }}
      />
      <div
        aria-hidden
        data-testid="scroll-paper-layer"
        className="pointer-events-none fixed inset-0 z-[41] overflow-hidden"
      >
        <motion.div className="absolute inset-x-0 -top-[120vh] h-[230vh]" style={{ y: paperY }}>
          {paper.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute h-4 w-2.5 shadow-[2px_3px_0_rgba(0,0,0,.2)] sm:h-5 sm:w-3"
              style={{
                left: `${piece.left}%`,
                top: `${piece.top}%`,
                backgroundColor: piece.color,
              }}
              animate={{
                x: [0, piece.drift, -piece.drift * 0.35, 0],
                rotate: [piece.rotate, piece.rotate + 230, piece.rotate + 480],
              }}
              transition={{
                duration: 4.6 + (piece.id % 5),
                delay: piece.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
      <aside className="pointer-events-none fixed right-3 top-1/2 z-[45] hidden -translate-y-1/2 items-center gap-3 xl:flex">
        <div className="relative h-48 w-1 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-[#f5cb45]"
            style={{ scaleY: progress }}
          />
        </div>
        <div className="flex h-48 flex-col justify-between text-[8px] font-black uppercase tracking-[0.16em] text-white">
          <span>Entry</span>
          <span>Drop</span>
          <span>Boss</span>
          <span>Laugh</span>
          <span>Climax</span>
        </div>
      </aside>
    </>
  )
}

function SoundController() {
  const [enabled, setEnabled] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)
  const humRef = useRef<OscillatorNode | null>(null)
  const enabledRef = useRef(false)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    const play = (event: Event) => {
      if (!enabledRef.current || !contextRef.current) return
      const context = contextRef.current
      const name = (event as CustomEvent<string>).detail
      const now = context.currentTime

      if (name === "laugh") {
        ;[0, 0.11, 0.23, 0.36].forEach((delay, index) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = index % 2 ? "square" : "triangle"
          oscillator.frequency.setValueAtTime(320 + index * 46, now + delay)
          oscillator.frequency.exponentialRampToValueAtTime(520 + index * 38, now + delay + 0.08)
          gain.gain.setValueAtTime(0.0001, now + delay)
          gain.gain.exponentialRampToValueAtTime(0.045, now + delay + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.1)
          oscillator.connect(gain).connect(context.destination)
          oscillator.start(now + delay)
          oscillator.stop(now + delay + 0.11)
        })
        return
      }

      if (name === "cheer" || name === "whoosh") {
        const duration = name === "cheer" ? 0.75 : 0.35
        const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
        const data = buffer.getChannelData(0)
        for (let index = 0; index < data.length; index += 1) {
          data[index] = Math.random() * 2 - 1
        }
        const source = context.createBufferSource()
        const filter = context.createBiquadFilter()
        const gain = context.createGain()
        source.buffer = buffer
        filter.type = "bandpass"
        filter.frequency.setValueAtTime(name === "cheer" ? 1100 : 600, now)
        filter.frequency.exponentialRampToValueAtTime(name === "cheer" ? 2100 : 2200, now + duration)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(name === "cheer" ? 0.08 : 0.045, now + 0.08)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
        source.connect(filter).connect(gain).connect(context.destination)
        source.start()
        return
      }

      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = "sawtooth"
      oscillator.frequency.setValueAtTime(180, now)
      oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.16)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.055, now + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start()
      oscillator.stop(now + 0.24)
    }
    window.addEventListener("gtheta-sound", play)
    return () => window.removeEventListener("gtheta-sound", play)
  }, [])

  const toggle = () => {
    if (enabled) {
      humRef.current?.stop()
      humRef.current = null
      void contextRef.current?.close()
      contextRef.current = null
      setEnabled(false)
      return
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const context = new AudioCtx()
      const hum = context.createOscillator()
      const gain = context.createGain()
      const filter = context.createBiquadFilter()
      hum.type = "sawtooth"
      hum.frequency.value = 54
      filter.type = "lowpass"
      filter.frequency.value = 120
      gain.gain.value = 0.012
      hum.connect(filter).connect(gain).connect(context.destination)
      hum.start()
      contextRef.current = context
      humRef.current = hum
      enabledRef.current = true
      setEnabled(true)
      window.setTimeout(() => {
        window.dispatchEvent(new Event("gtheta-replay-entry"))
      }, 60)
    } catch {}
  }

  return (
    <button
      data-testid="sound-toggle"
      onClick={toggle}
      aria-pressed={enabled}
      className="fixed bottom-3 right-3 z-[90] flex items-center gap-2 rounded-full border-2 border-black bg-[#f5cb45] px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.12em] text-black shadow-[4px_4px_0_#d83a2e] transition hover:-translate-y-1 sm:bottom-4 sm:right-4 sm:px-4 sm:py-3 sm:text-[10px] sm:tracking-[0.15em]"
    >
      {enabled ? <Volume2 size={16} fill="currentColor" /> : <VolumeX size={16} />}
      Sound {enabled ? "on" : "off"}
    </button>
  )
}

function SiteNav() {
  const { totalCount, openCart } = useCart()
  const [open, setOpen] = useState(false)
  const links = [
    ["#drop", "Drop 01"],
    ["#lookbook", "Lookbook"],
    ["#memes", "Boss says"],
    ["#laugh", "Laugh"],
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

function HeroPaperStorm() {
  return (
    <div
      aria-hidden
      data-testid="hero-paper-storm"
      className="pointer-events-none absolute inset-0 z-[24] overflow-hidden"
    >
      {heroPaper.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute bottom-[-7%] block shadow-[2px_3px_0_rgba(0,0,0,.2)]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.45,
            backgroundColor: piece.color,
          }}
          animate={{
            x: [0, piece.drift * 0.45, piece.drift, piece.drift * -0.2],
            y: ["0vh", "-48vh", "-106vh"],
            rotate: [piece.rotate, piece.rotate + 280, piece.rotate + 690],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            repeatDelay: 0.15 + (piece.id % 5) * 0.11,
            ease: [0.22, 0.72, 0.26, 1],
          }}
        />
      ))}
    </div>
  )
}

function CinemaDoors({ cycle }: { cycle: number }) {
  const lines = Array.from({ length: 7 })
  return (
    <div
      aria-hidden
      data-testid="cinema-doors"
      className="pointer-events-none absolute inset-0 z-[32] overflow-hidden"
    >
      <motion.div
        key={`left-door-${cycle}`}
        initial={{ x: "0%" }}
        animate={{ x: "-102%" }}
        transition={{ delay: 0.65, duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 left-0 w-[50.5%] border-r-4 border-[#f5cb45] bg-[linear-gradient(100deg,#5f0908,#d83a2e_72%,#8a110d)] shadow-[25px_0_60px_rgba(0,0,0,.75)]"
      >
        <div className="absolute inset-5 border border-[#f5cb45]/55 sm:inset-8">
          {lines.map((_, index) => (
            <span
              key={index}
              className="absolute left-[8%] right-[8%] h-px bg-[#f5cb45]/25"
              style={{ top: `${14 + index * 12}%` }}
            />
          ))}
        </div>
        <div className="absolute right-5 top-1/2 h-16 w-5 -translate-y-1/2 rounded-full border-2 border-black bg-[#f5cb45] shadow-[3px_3px_0_#111]" />
        <p className="absolute bottom-10 right-8 font-display text-[clamp(2.6rem,7vw,7rem)] font-black uppercase leading-[0.75] text-[#f5cb45] opacity-90">
          First
        </p>
      </motion.div>
      <motion.div
        key={`right-door-${cycle}`}
        initial={{ x: "0%" }}
        animate={{ x: "102%" }}
        transition={{ delay: 0.65, duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 right-0 w-[50.5%] border-l-4 border-[#f5cb45] bg-[linear-gradient(260deg,#5f0908,#d83a2e_72%,#8a110d)] shadow-[-25px_0_60px_rgba(0,0,0,.75)]"
      >
        <div className="absolute inset-5 border border-[#f5cb45]/55 sm:inset-8">
          {lines.map((_, index) => (
            <span
              key={index}
              className="absolute left-[8%] right-[8%] h-px bg-[#f5cb45]/25"
              style={{ top: `${14 + index * 12}%` }}
            />
          ))}
        </div>
        <div className="absolute left-5 top-1/2 h-16 w-5 -translate-y-1/2 rounded-full border-2 border-black bg-[#f5cb45] shadow-[3px_3px_0_#111]" />
        <p className="absolute bottom-10 left-8 font-display text-[clamp(2.6rem,7vw,7rem)] font-black uppercase leading-[0.75] text-[#f5cb45] opacity-90">
          Show
        </p>
      </motion.div>
    </div>
  )
}

function Hero() {
  const { scrollYProgress } = useScroll()
  const titleY = useTransform(scrollYProgress, [0, 0.16], [0, 150])
  const [scene, setScene] = useState(0)
  const characterTargetX = useMotionValue(0)
  const characterTargetRotate = useMotionValue(0)
  const characterX = useSpring(characterTargetX, { stiffness: 95, damping: 18 })
  const characterRotate = useSpring(characterTargetRotate, { stiffness: 95, damping: 18 })

  useEffect(() => {
    const replay = () => setScene((value) => value + 1)
    window.addEventListener("gtheta-replay-entry", replay)
    return () => window.removeEventListener("gtheta-replay-entry", replay)
  }, [])

  const replay = () => {
    setScene((value) => value + 1)
  }

  return (
    <section
      id="top"
      data-testid="interactive-hero"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const ratio = (event.clientX - bounds.left) / bounds.width - 0.5
        characterTargetX.set(ratio * 34)
        characterTargetRotate.set(ratio * 2.2)
      }}
      onPointerLeave={() => {
        characterTargetX.set(0)
        characterTargetRotate.set(0)
      }}
      className="relative min-h-[100svh] overflow-hidden bg-black pt-[72px]"
    >
      <motion.div
        key={`background-${scene}`}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero-theatre-empty.webp"
          alt="A cheering single-screen theatre crowd facing an open cinematic doorway"
          fill
          priority
          sizes="100vw"
          className="hero-background-image object-cover object-[58%_center]"
        />
      </motion.div>
      <div className="hero-mobile-gradient absolute inset-0 z-[5] bg-[linear-gradient(90deg,rgba(6,5,3,.94)_0%,rgba(6,5,3,.72)_31%,rgba(6,5,3,.04)_67%),linear-gradient(0deg,rgba(6,5,3,.92)_0%,transparent_46%)]" />
      <div className="hero-vignette absolute inset-0 z-[6]" />

      <motion.div
        style={{ x: characterX, rotate: characterRotate }}
        className="pointer-events-none absolute bottom-[-2%] left-[60%] z-[12] h-[82%] w-[min(35vw,520px)] min-w-[270px] -translate-x-1/2 origin-bottom sm:left-[58%] lg:left-[57%]"
      >
        <motion.div
          key={`meher-entry-${scene}`}
          data-testid="meher-walk-in"
          initial={{ opacity: 0, y: 120, scale: 0.48, filter: "blur(5px)" }}
          animate={{
            opacity: [0, 1, 1],
            y: [120, 42, 0],
            scale: [0.48, 0.74, 1],
            filter: ["blur(5px)", "blur(1px)", "blur(0px)"],
          }}
          transition={{ delay: 0.95, duration: 2.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full origin-bottom drop-shadow-[0_30px_28px_rgba(0,0,0,.65)]"
        >
          <Image
            src="/images/meher-walk.webp"
            alt="Meher Ramesh walking into the theatre in a black suit with a prop handgun held down"
            fill
            priority
            sizes="(max-width: 640px) 270px, 35vw"
            className="object-contain object-bottom"
          />
        </motion.div>
      </motion.div>

      <HeroPaperStorm />
      <CinemaDoors cycle={scene} />

      <motion.div
        key={`parody-label-${scene}`}
        initial={{ opacity: 0, rotate: -7, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -7, scale: 1 }}
        transition={{ delay: 1.75, type: "spring" }}
        className="absolute left-4 top-24 z-[25] hidden border-2 border-[#f5cb45] px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#f5cb45] md:block"
      >
        Interactive entry
        <br />
        front bench cut
      </motion.div>

      <div className="relative z-[20] mx-auto flex min-h-[calc(100svh-72px)] max-w-[1600px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 sm:pt-12 lg:px-14 lg:pb-10 lg:pt-16">
        <motion.div
          key={`hero-copy-${scene}`}
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.72, duration: 0.75 }}
          className="max-w-3xl"
          style={{ y: titleY }}
        >
          <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#f5cb45]">
            <span className="h-px w-10 bg-[#f5cb45]" />
            Hyderabad · Drop 01 · 2026
          </div>
          <h1 className="max-w-[48rem] font-display text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.72] tracking-[-0.065em]">
            Meme
            <span className="hero-stroke block">Material.</span>
          </h1>
          <div className="mt-7 max-w-xl border-l-4 border-[#d83a2e] pl-4">
            <p className="font-display text-xl font-black uppercase leading-tight text-[#f5cb45] sm:text-2xl">
              Your reaction. Your hoodie.
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/65 sm:text-base">
              Telugu internet culture, cut in heavyweight cotton. Built for the first-day,
              first-show person in you.
            </p>
          </div>
        </motion.div>

        <motion.div
          key={`hero-actions-${scene}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7 }}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("#drop")}
              className="flex items-center gap-3 rounded-full bg-[#d83a2e] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:bg-white hover:text-black"
            >
              Shop the drop <ArrowDown size={17} />
            </button>
            <button
              data-testid="replay-entry"
              onClick={replay}
              className="group flex items-center gap-3 rounded-full bg-[#f5cb45] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-1 hover:bg-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[#f5cb45] transition group-hover:rotate-12">
                <Play size={15} fill="currentColor" />
              </span>
              Replay entry
            </button>
          </div>
          <div className="max-w-xs text-left sm:text-right">
            <div className="mb-2 flex items-center gap-1 sm:justify-end">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={13} className="fill-[#f5cb45] text-[#f5cb45]" />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Crowd rating: papers never stop flying
            </p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#f5cb45]">
              Doors and crowd run automatically
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TheatreMarquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="overflow-hidden border-y-2 border-black bg-[#f5cb45] py-3 text-black">
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
  const colors = ["#fff4da", "#f5cb45", "#ff8abb", "#74a7ff"]

  return (
    <motion.article
      initial={{ opacity: 0, y: 70, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{ y: -12, rotate: index % 2 ? -1 : 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.08 }}
      className="group overflow-hidden rounded-[1.75rem] border-2 border-black text-black shadow-[7px_8px_0_#11100d]"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      <div className="relative aspect-[4/4.7] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.75),transparent_52%)]">
        <span className="absolute left-5 top-5 z-10 rounded-full border-2 border-black bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
          {copy.badge}
        </span>
        <span className="absolute right-5 top-5 z-10 font-mono text-[10px] text-black/55">
          {copy.edition}
        </span>
        <motion.div
          className="absolute inset-x-[14%] bottom-[5%] top-[8%]"
          whileHover={{ scale: 1.06, rotate: index % 2 ? 1.2 : -1.2 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <HoodieSvg
            colorFrom={product.colorFrom}
            colorTo={product.colorTo}
            className="h-full w-full drop-shadow-[0_28px_28px_rgba(0,0,0,.35)]"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[43%] w-[44%] -translate-x-1/2 -rotate-2 text-center"
            style={{ color: copy.ink }}
          >
            <p className="font-display text-[clamp(.8rem,2.2vw,1.65rem)] font-black uppercase leading-none tracking-[-0.04em]">
              {copy.line}
            </p>
          </div>
        </motion.div>
        <span className="absolute bottom-5 left-5 rounded-full border-2 border-black bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em]">
          480 GSM
        </span>
      </div>

      <div className="border-t-2 border-black p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#d83a2e]">
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
              className={`flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-black px-2 text-[10px] font-black transition ${
                size === item ? "bg-black text-[#f5cb45]" : "bg-white/55 hover:bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            addItem(product, size)
            emitSound("sting")
          }}
          className="mt-5 flex w-full items-center justify-between rounded-full border-2 border-black bg-white/55 px-5 py-3.5 text-xs font-black uppercase tracking-[0.16em] transition hover:bg-[#d83a2e] hover:text-white"
        >
          Add to bag
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
            <ArrowUpRight size={15} />
          </span>
        </button>
      </div>
    </motion.article>
  )
}

function DropSection() {
  return (
    <section
      id="drop"
      className="scroll-mt-20 overflow-hidden bg-[#d83a2e] px-5 py-24 text-[#f5cb45] sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 border-b-2 border-[#f5cb45]/45 pb-10 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white">
              Now playing · Drop 01
            </p>
            <h2 className="mt-4 max-w-5xl font-display text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[-0.055em]">
              Four moods.
              <span className="block text-white">Zero context.</span>
            </h2>
          </div>
          <p className="max-w-lg text-base font-semibold leading-7 text-white/80 lg:justify-self-end">
            Not screenshots pasted on cloth. Each line is rebuilt as wearable typography, screen
            printed on dense 480 GSM brushed cotton with an oversized Hyderabad fit.
          </p>
        </div>
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
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
    <section id="lookbook" className="scroll-mt-16 bg-[#f5cb45] px-3 py-10 sm:px-6">
      <div className="relative mx-auto min-h-[74svh] max-w-[1580px] overflow-hidden rounded-[2rem] border-2 border-black shadow-[8px_8px_0_#d83a2e]">
        <Image
          src="/images/lookbook.webp"
          alt="Four South Indian models in red, cream, black, and yellow oversized hoodies"
          fill
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/25" />
        <motion.div
          className="absolute right-5 top-5 z-10 rotate-6 rounded-full border-2 border-black bg-[#ff3e91] px-5 py-3 font-display text-xl font-black uppercase text-black shadow-[4px_4px_0_#f5cb45]"
          animate={{ rotate: [6, -3, 6], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          Wear the reaction
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 z-10 grid gap-6 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <p className="eyebrow">Front bench uniform</p>
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.055em]">
              Outside silent.
              <span className="block text-[#f5cb45]">Inside theatre.</span>
            </h2>
          </div>
          <div className="max-w-sm rounded-2xl border-2 border-white bg-black/70 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[#f5cb45]">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.22em]">The fit</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/75">
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
    <section id="memes" className="scroll-mt-20 bg-[#fff4da] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2rem] border-2 border-black bg-[#f1e8d6] text-[#11100d] shadow-[10px_10px_0_#d83a2e] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative min-h-[560px] overflow-visible lg:min-h-[760px]"
        >
          <Image
            src="/images/chiru-approval.webp"
            alt="A satirical editorial portrait of Chiranjeevi giving a warm approving reaction"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <motion.button
            data-testid="chiru-speech"
            onClick={() => emitSound("sting")}
            initial={{ opacity: 0, scale: 0.15, x: -50, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.35 }}
            className="speech-bubble absolute left-[53%] top-[39%] z-20 rounded-[45%] border-2 border-black bg-[#f5cb45] px-7 py-5 text-center font-display text-[clamp(1.5rem,3vw,3rem)] font-black uppercase leading-[0.85] text-[#d83a2e] shadow-[7px_7px_0_#1667ff]"
          >
            Baavundi!
          </motion.button>
          {[
            ["IT'S NICE!", "left-[5%] top-[10%] -rotate-6 bg-white"],
            ["SUPER!", "right-[4%] top-[68%] rotate-6 bg-[#ff3e91]"],
            ["APPROVED!", "left-[8%] bottom-[8%] rotate-3 bg-[#1667ff] text-white"],
          ].map(([label, position], index) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.55 + index * 0.14 }}
              className={`absolute z-10 rounded-full border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-[4px_4px_0_#111] ${position}`}
            >
              {label}
            </motion.span>
          ))}
          <span className="absolute bottom-5 left-5 rounded-full bg-black/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
            Original parody portrait
          </span>
        </motion.div>

        <div className="relative flex flex-col justify-between overflow-hidden bg-[#f5cb45] p-7 sm:p-12 lg:p-16">
          <span className="absolute -right-10 -top-16 font-display text-[16rem] font-black leading-none text-[#d83a2e]/15">
            “
          </span>
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d83a2e]">
              Boss verdict · Approved
            </p>
            <h2 className="mt-8 font-display text-[clamp(3.35rem,7vw,7rem)] font-black uppercase leading-[0.7] tracking-[-0.07em]">
              Baavundi.
            </h2>
            <p className="mt-7 max-w-md font-display text-3xl font-black uppercase leading-none text-[#d83a2e] sm:text-5xl">
              It&apos;s nice. Ship it.
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

function AlluLaughSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [burst, setBurst] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const wordX = useTransform(scrollYProgress, [0, 1], ["12%", "-24%"])
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 1, 4])

  const laugh = () => {
    setBurst((value) => value + 1)
    emitSound("laugh")
  }

  return (
    <section
      ref={sectionRef}
      id="laugh"
      data-testid="allu-laugh-section"
      className="relative scroll-mt-20 overflow-hidden border-y-2 border-black bg-[#f5cb45] py-20 text-black lg:py-28"
    >
      <motion.p
        aria-hidden
        className="pointer-events-none absolute top-4 whitespace-nowrap font-display text-[clamp(5rem,15vw,15rem)] font-black uppercase leading-none tracking-[-0.08em] text-[#d83a2e]"
        style={{ x: wordX }}
      >
        HAHAHA HAHAHA HAHAHA
      </motion.p>
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-12 px-5 pt-24 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-12">
        <div>
          <p className="inline-flex rotate-[-3deg] items-center gap-2 border-2 border-black bg-[#1667ff] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white shadow-[4px_4px_0_#111]">
            <Music2 size={14} /> Reaction unlocked
          </p>
          <h2 className="mt-8 font-display text-[clamp(3.2rem,10vw,10rem)] font-black uppercase leading-[0.72] tracking-[-0.065em]">
            Can&apos;t.
            <span className="block text-[#d83a2e]">Stop.</span>
            Laughing.
          </h2>
          <p className="mt-7 max-w-lg text-lg font-bold leading-7">
            That exact face when the hoodie hits harder than the movie&apos;s interval block.
          </p>
          <button
            data-testid="laugh-button"
            onClick={laugh}
            className="mt-8 inline-flex items-center gap-3 rounded-full border-2 border-black bg-[#ff3e91] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_#1667ff] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_#1667ff]"
          >
            <Zap size={18} fill="currentColor" /> Make him laugh
          </button>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-3xl"
          style={{ rotate: imageRotate }}
          whileHover={{ scale: 1.015 }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-black bg-[#d83a2e] shadow-[12px_14px_0_#1667ff]">
            <Image
              src="/images/allu-laugh.webp"
              alt="An original campaign-style parody portrait of Allu Arjun laughing in a colorful cinema booth"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
          </div>
          {[
            ["LOL", "-left-4 top-[12%] -rotate-12 bg-white"],
            ["MOOD", "-right-3 top-[8%] rotate-12 bg-[#ff3e91]"],
            ["FULL HAPPY", "left-[4%] -bottom-5 rotate-6 bg-[#d83a2e] text-white"],
            ["10/10", "right-[8%] -bottom-4 -rotate-6 bg-[#1667ff] text-white"],
          ].map(([label, position], index) => (
            <motion.span
              key={label}
              className={`absolute rounded-full border-2 border-black px-5 py-3 font-display text-xl font-black uppercase shadow-[5px_5px_0_#111] ${position}`}
              animate={{ y: [0, -10 - index * 2, 0], rotate: [0, index % 2 ? 4 : -4, 0] }}
              transition={{ duration: 2 + index * 0.25, repeat: Infinity }}
            >
              {label}
            </motion.span>
          ))}
          <AnimatePresence>
            {burst > 0 && (
              <motion.div
                key={burst}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {paper.slice(0, 18).map((piece) => (
                  <motion.span
                    key={piece.id}
                    className="absolute left-1/2 top-1/2 rounded-full border-2 border-black px-3 py-1 text-[10px] font-black"
                    style={{ backgroundColor: piece.color }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: (piece.id % 2 ? 1 : -1) * (70 + (piece.id % 6) * 65),
                      y: -220 + (piece.id % 7) * 75,
                      rotate: piece.rotate + 360,
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.1, 1, 0.7],
                    }}
                    transition={{ duration: 1.25, delay: piece.delay * 0.3 }}
                  >
                    HA!
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function MemeHall() {
  const reactions = [
    { name: "Side eye", use: "When the trailer says “pan-world”", color: "#929d52" },
    { name: "Full happy", use: "When the interval block actually lands", color: "#f5cb45" },
    { name: "Manakenduku", use: "When the group chat starts fan wars", color: "#ff3e91" },
  ]

  return (
    <section className="border-y-2 border-black bg-[#1667ff] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f5cb45]">
              The reaction archive
            </p>
            <h2 className="mt-3 font-display text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.055em]">
              Meme hall
              <span className="text-[#f5cb45]"> of fame.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-white/80">
            Three expressions. Roughly ninety percent of Telugu group-chat communication.
          </p>
        </div>
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] border-2 border-black shadow-[10px_10px_0_#f5cb45]"
        >
          <Image
            src="/images/meme-legends.webp"
            alt="A three-panel tribute to iconic Telugu comedy reaction faces"
            width={3072}
            height={1024}
            sizes="100vw"
            className="h-auto w-full"
          />
        </motion.div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reactions.map((reaction, index) => (
            <motion.button
              key={reaction.name}
              onClick={() => emitSound(index === 1 ? "laugh" : "sting")}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, rotate: index - 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border-2 border-black bg-[#fff4da] p-5 text-left text-black shadow-[6px_6px_0_#111]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full border-2 border-black px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black"
                  style={{ backgroundColor: reaction.color }}
                >
                  0{index + 1}
                </span>
                <Play size={14} fill="currentColor" />
              </div>
              <h3 className="mt-7 font-display text-3xl font-black uppercase">{reaction.name}</h3>
              <p className="mt-2 text-sm font-semibold text-black/60">{reaction.use}</p>
            </motion.button>
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
    <section
      id="quality"
      className="scroll-mt-20 bg-[#fff4da] px-5 py-24 text-black sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d83a2e]">
              No cheap fan merch
            </p>
            <h2 className="mt-4 font-display text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.76] tracking-[-0.06em]">
              Joke soft.
              <span className="block text-[#d83a2e]">Hoodie hard.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg font-semibold leading-8 text-black/60">
              The meme gets the laugh. The garment earns the repeat wear. Every drop is sampled,
              washed, stretched and reworked before it reaches the front bench.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div
                  key={check}
                  className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-4 text-sm font-semibold shadow-[4px_4px_0_#f5cb45]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d83a2e] text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {check}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([number, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9, rotate: index % 2 ? 4 : -4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ rotate: index % 2 ? -2 : 2, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="min-h-64 rounded-[1.5rem] border-2 border-black p-7 shadow-[6px_6px_0_#111] sm:min-h-80"
                style={{ backgroundColor: ["#f5cb45", "#ff3e91", "#1667ff", "#d83a2e"][index] }}
              >
                <p className={`font-display text-[clamp(5rem,10vw,10rem)] font-black leading-none tracking-[-0.08em] ${index > 1 ? "text-white" : ""}`}>
                  {number}
                </p>
                <p className={`mt-6 max-w-[10rem] text-xs font-black uppercase tracking-[0.2em] ${index > 1 ? "text-white/80" : "text-black/60"}`}>
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
    <footer className="overflow-hidden border-t-2 border-black bg-[#d83a2e] text-white">
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:px-12 lg:py-24">
        <div>
          <BrandLockup />
          <h2 className="mt-10 max-w-4xl font-display text-[clamp(3.8rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.06em]">
            Next drop?
            <span className="block text-[#f5cb45]">First show is yours.</span>
          </h2>
        </div>
        <form
          className="self-end"
          onSubmit={(event) => {
            event.preventDefault()
            notify("You're on the list! First-show updates will land here 🎟️")
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
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent py-4 text-xl font-bold outline-none placeholder:text-white/45"
            />
            <button aria-label="Subscribe" className="px-4 transition hover:text-[#f5cb45]">
              <ArrowUpRight size={28} />
            </button>
          </div>
          <p className="mt-3 text-xs text-white/65">Drop alerts only. No boring spam.</p>
        </form>
      </div>
      <div className="border-t border-white/20 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} G Theta · Hyderabad, India</p>
          <p>Demo storefront · Parody visuals · No real payment processed</p>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap font-display text-[21vw] font-black uppercase leading-[0.67] tracking-[-0.08em] text-[#f5cb45]"
      >
        G THETA
      </div>
    </footer>
  )
}

export function TeluguStorefront() {
  return (
    <>
      <ScrollFunLayer />
      <SoundController />
      <SiteNav />
      <main>
        <Hero />
        <TheatreMarquee />
        <DropSection />
        <Lookbook />
        <ChiruApproval />
        <AlluLaughSection />
        <MemeHall />
        <Quality />
      </main>
      <Footer />
    </>
  )
}
