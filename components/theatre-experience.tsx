"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react"
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  CirclePause,
  CirclePlay,
  MapPin,
  MousePointer2,
  ShoppingBag,
  Sparkles,
  Ticket,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"
import { products, type Product } from "@/lib/products"
import styles from "./theatre-experience.module.css"

const CHAPTERS = [
  { range: [0, 0.13], code: "00", kicker: "Abids · 9:47 PM", title: "The gates are waiting", copy: "One ticket. One night. One gloriously loud first show." },
  { range: [0.13, 0.34], code: "01", kicker: "Outside the theatre", title: "The street becomes a festival", copy: "Cutouts, garlands, drums and enough paper to change the weather." },
  { range: [0.34, 0.54], code: "02", kicker: "The interval lobby", title: "Follow the smell of popcorn", copy: "Irani chai on the left. The limited GO drop on the right." },
  { range: [0.54, 0.76], code: "03", kicker: "Balcony filling fast", title: "Find your seat. Lose your voice.", copy: "Move around the frame. Every wall is part of the show." },
  { range: [0.76, 0.92], code: "04", kicker: "The lights go down", title: "This is the entry shot", copy: "The projector hits. The theatre lifts off." },
  { range: [0.92, 1.01], code: "05", kicker: "Interval", title: "Wear the reaction", copy: "The screen becomes the shop. Pick the meme they already know." },
] as const

const HOTSPOTS = {
  chai: {
    eyebrow: "Lobby counter 01",
    title: "Irani chai, extra loud",
    copy: "A tiny glass, a massive debate about the interval block, and exactly four minutes before the bell.",
    accent: "#f4c638",
  },
  merch: {
    eyebrow: "Lobby counter 02",
    title: "The GO drop window",
    copy: "Heavy washed cotton, Telugu internet history, and prints built to survive the front bench.",
    accent: "#ef3b2f",
  },
  balcony: {
    eyebrow: "House map",
    title: "Best noise in the balcony",
    copy: "Turn toward the projector, then scroll forward. The crowd gets louder as the hero appears.",
    accent: "#f4c638",
  },
} as const

const PAPER_COLORS = ["#ef3b2f", "#f4c638", "#1373ff", "#ff3c96", "#f5efe3", "#6bd02e"]

function createPaper(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: (index * 47) % 101,
    delay: (index % 18) * -0.31,
    duration: 3.8 + (index % 8) * 0.41,
    drift: ((index % 2 ? 1 : -1) * (24 + (index % 7) * 13)),
    size: 7 + (index % 5) * 3,
    color: PAPER_COLORS[index % PAPER_COLORS.length],
    rotate: (index * 67) % 250,
  }))
}

function Soundscape({ entered }: { entered: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [soundOn, setSoundOn] = useState(true)

  useEffect(() => {
    const playEntry = () => {
      if (!entered || !soundOn || !audioRef.current) return
      const audio = audioRef.current
      if (audio.duration > 22 && audio.currentTime < 19.5) audio.currentTime = 20
      void audio.play().catch(() => undefined)
    }
    playEntry()
  }, [entered, soundOn])

  const toggle = () => {
    const next = !soundOn
    setSoundOn(next)
    if (!audioRef.current) return
    if (next) {
      if (audioRef.current.duration > 22 && audioRef.current.currentTime < 19.5) audioRef.current.currentTime = 20
      void audioRef.current.play().catch(() => undefined)
    } else {
      audioRef.current.pause()
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/adaraku-entry.mp3"
        preload="auto"
        playsInline
        onLoadedMetadata={(event) => {
          if (event.currentTarget.duration > 22) event.currentTarget.currentTime = 20
        }}
      />
      <button className={styles.soundButton} onClick={toggle} aria-pressed={soundOn}>
        {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>{soundOn ? "Sound on" : "Sound off"}</span>
      </button>
    </>
  )
}

function PaperStorm({ active }: { active: boolean }) {
  const pieces = useMemo(() => createPaper(76), [])
  return (
    <div className={`${styles.paperStorm} ${active ? styles.paperStormActive : ""}`} aria-hidden>
      {pieces.map((piece) => (
        <i
          key={piece.id}
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 1.42,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            "--drift": `${piece.drift}px`,
            "--spin": `${piece.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function TheatreGate({ entered, opening, onEnter }: { entered: boolean; opening: boolean; onEnter: () => void }) {
  return (
    <AnimatePresence>
      {!entered && (
        <motion.section
          className={styles.gateIntro}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.75, delay: 1.15 }}
        >
          <Image
            src="/images/experience-exterior.webp"
            alt="An old Hyderabad single-screen theatre at night"
            fill
            priority
            sizes="100vw"
            className={styles.gateBackdrop}
          />
          <div className={styles.gateAtmosphere} />
          <div className={`${styles.gateLeaf} ${styles.gateLeft}`} data-open={opening}>
            <span className={styles.gateBars} />
          </div>
          <div className={`${styles.gateLeaf} ${styles.gateRight}`} data-open={opening}>
            <span className={styles.gateBars} />
          </div>

          <div className={styles.gateBrand}>
            <Logo className={styles.gateLogo} />
            <p>Hyderabad · First day · First show</p>
          </div>

          <motion.div
            className={styles.entryTicket}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            <span className={styles.ticketNumber}>GΘ / 001</span>
            <h1>The theatre is already shouting.</h1>
            <p>Sound starts after you enter. Scroll becomes your camera.</p>
            <button onClick={onEnter} className={styles.enterButton} disabled={opening}>
              <span>Enter the theatre</span>
              <ChevronRight size={20} />
            </button>
          </motion.div>

          <div className={styles.gateFooter}>
            <span><MapPin size={14} /> Hyderabad, India</span>
            <span>Best with sound</span>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

function JourneyHud({ progress, active, onCart }: { progress: number; active: number; onCart: () => void }) {
  const { totalCount } = useCart()
  return (
    <header className={styles.hud}>
      <a href="#journey" className={styles.brand} aria-label="GO home">
        <Logo className={styles.brandLogo} />
        <span><b>GO</b><small>Meme material</small></span>
      </a>
      <div className={styles.hudCenter}>
        <span>{CHAPTERS[active].code}</span>
        <div className={styles.progressTrack}><i style={{ transform: `scaleX(${progress})` }} /></div>
        <span>05</span>
      </div>
      <button className={styles.bagButton} onClick={onCart}>
        <ShoppingBag size={16} />
        <span>Bag</span>
        <b>{totalCount}</b>
      </button>
    </header>
  )
}

function HotspotButton({
  className,
  label,
  onClick,
}: {
  className: string
  label: string
  onClick: () => void
}) {
  return (
    <button className={`${styles.hotspot} ${className}`} onClick={onClick}>
      <i><span /></i>
      <b>{label}</b>
    </button>
  )
}

function HotspotCard({ selected, onClose }: { selected: keyof typeof HOTSPOTS | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.aside
          className={styles.hotspotCard}
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 18 }}
        >
          <button onClick={onClose} aria-label="Close detail"><X size={17} /></button>
          <span style={{ color: HOTSPOTS[selected].accent }}>{HOTSPOTS[selected].eyebrow}</span>
          <h3>{HOTSPOTS[selected].title}</h3>
          <p>{HOTSPOTS[selected].copy}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function TheatreJourney({
  entered,
  onProgress,
}: {
  entered: boolean
  onProgress: (progress: number, active: number) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [progressNumber, setProgressNumber] = useState(0)
  const [selectedHotspot, setSelectedHotspot] = useState<keyof typeof HOTSPOTS | null>(null)
  const [paused, setPaused] = useState(false)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 24, mass: 0.35 })

  useMotionValueEvent(progress, "change", (value) => {
    const normalized = Math.max(0, Math.min(1, value))
    setProgressNumber(normalized)
    const next = CHAPTERS.findIndex(({ range }) => normalized >= range[0] && normalized < range[1])
    const nextActive = next < 0 ? CHAPTERS.length - 1 : next
    setActive(nextActive)
    onProgress(normalized, nextActive)
    const video = videoRef.current
    if (!paused && video?.duration && Number.isFinite(video.duration)) {
      const nextTime = Math.min(video.duration - 0.04, normalized * video.duration)
      if (Math.abs(video.currentTime - nextTime) > 0.025) video.currentTime = nextTime
    }
  })

  const look = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    stageRef.current?.style.setProperty("--look-x", `${x * -3.5}%`)
    stageRef.current?.style.setProperty("--look-y", `${y * -2.25}%`)
  }

  return (
    <section ref={sectionRef} id="journey" className={styles.journey}>
      <div
        ref={stageRef}
        className={styles.stage}
        onPointerMove={look}
        onPointerLeave={() => {
          stageRef.current?.style.setProperty("--look-x", "0%")
          stageRef.current?.style.setProperty("--look-y", "0%")
        }}
      >
        <video
          ref={videoRef}
          className={styles.journeyVideo}
          src="/video/theatre-journey.mp4"
          poster="/images/experience-exterior.webp"
          preload="auto"
          muted
          playsInline
          aria-label="A cinematic journey through a Hyderabad single-screen theatre"
        />
        <div className={styles.stageGrade} />
        <div className={styles.projectorBeam} data-visible={active >= 3 && active <= 4} />
        <PaperStorm active={entered && active >= 1} />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={styles.chapterCopy}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.5 }}
          >
            <span>{CHAPTERS[active].kicker}</span>
            <h2>{CHAPTERS[active].title}</h2>
            <p>{CHAPTERS[active].copy}</p>
          </motion.div>
        </AnimatePresence>

        {active === 2 && (
          <>
            <HotspotButton className={styles.hotspotChai} label="Chai counter" onClick={() => setSelectedHotspot("chai")} />
            <HotspotButton className={styles.hotspotMerch} label="Explore the drop" onClick={() => setSelectedHotspot("merch")} />
          </>
        )}
        {active === 3 && (
          <HotspotButton className={styles.hotspotBalcony} label="Look around" onClick={() => setSelectedHotspot("balcony")} />
        )}

        <HotspotCard selected={selectedHotspot} onClose={() => setSelectedHotspot(null)} />

        <div className={styles.lookHint}>
          <MousePointer2 size={15} />
          <span>Move to look</span>
          <i />
          <ArrowDown size={15} />
          <span>Scroll to walk</span>
        </div>

        <button className={styles.scrubToggle} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume scroll film" : "Pause scroll film"}>
          {paused ? <CirclePlay size={18} /> : <CirclePause size={18} />}
        </button>

        <nav className={styles.chapterRail} aria-label="Theatre journey progress">
          {CHAPTERS.map((chapter, index) => (
            <a key={chapter.code} href={`#chapter-${index}`} data-active={index === active}>
              <b>{chapter.code}</b><span>{chapter.kicker}</span>
            </a>
          ))}
        </nav>

        <div className={styles.mobileProgress}><i style={{ transform: `scaleX(${progressNumber})` }} /></div>
      </div>
      {CHAPTERS.map((chapter, index) => (
        <div
          id={`chapter-${index}`}
          className={styles.chapterMarker}
          style={{ top: `${chapter.range[0] * 100}%` }}
          key={chapter.code}
        />
      ))}
    </section>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  return (
    <motion.article
      className={styles.productCard}
      initial={{ opacity: 0, y: 70, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.08 }}
    >
      <div className={styles.productImageWrap}>
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 45vw, 25vw" className={styles.productImage} />
        ) : null}
        <span>{product.badge}</span>
        <b>{String(index + 1).padStart(2, "0")}</b>
      </div>
      <div className={styles.productInfo}>
        <div><small>{product.code}</small><h3>{product.name}</h3></div>
        <p>₹{product.price.toLocaleString("en-IN")}</p>
      </div>
      <button onClick={() => addItem(product, "L")}>
        Add to interval bag <ArrowUpRight size={17} />
      </button>
    </motion.article>
  )
}

function IntervalShop() {
  const [showAll, setShowAll] = useState(false)
  const visibleProducts = showAll ? products : products.slice(0, 8)
  return (
    <section id="drop" className={styles.shop}>
      <div className={styles.shopMarquee} aria-hidden>
        <div>{Array.from({ length: 8 }, (_, i) => <span key={i}>INTERVAL SHOPPING <Sparkles size={22} /></span>)}</div>
      </div>
      <div className={styles.shopHeading}>
        <div>
          <span>Drop 01 · Now screening</span>
          <h2>Wear the<br /><em>reaction.</em></h2>
        </div>
        <aside>
          <Ticket size={32} />
          <b>15 limited prints</b>
          <p>Heavyweight hoodies cut for late-night rides, interval samosas and unsolicited movie reviews.</p>
        </aside>
      </div>
      <div className={styles.productGrid}>
        {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
      </div>
      {!showAll && <button className={styles.allProducts} onClick={() => setShowAll(true)}>Roll the full drop <ArrowDown size={18} /></button>}
    </section>
  )
}

function ReactionHall() {
  return (
    <section className={styles.reactionHall}>
      <div className={styles.reactionIntro}>
        <span>Audience response</span>
        <h2>No five-star reviews.<br />Only theatre reactions.</h2>
      </div>
      <div className={styles.reactionGrid}>
        <motion.article whileHover={{ rotate: -1.5, scale: 1.015 }}>
          <Image src="/images/allu-laugh.webp" alt="A popular laughing reaction" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <div className={styles.hahaTrail} aria-hidden><i>HA</i><i>HAHA</i><i>HAHAHAHA</i></div>
          <footer><span>Laugh track 01</span><b>When the fit is too clean</b></footer>
        </motion.article>
        <motion.article whileHover={{ rotate: 1.5, scale: 1.015 }}>
          <Image src="/images/chiru-approval.webp" alt="A popular approving reaction" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <div className={styles.speechCard}><small>Boss verdict</small><strong>BAAVUNDI.<br />IT&apos;S NICE.</strong></div>
          <footer><span>Approval 100%</span><b>Certified interval purchase</b></footer>
        </motion.article>
      </div>
    </section>
  )
}

function Credits() {
  return (
    <footer className={styles.credits}>
      <div><Logo className={styles.footerLogo} /><p>Telugu internet culture, cut in heavyweight cotton.</p></div>
      <div className={styles.creditTicket}>
        <span>Admit one</span><b>GO / DROP 01</b><small>Hyderabad · Worldwide</small>
      </div>
      <div className={styles.footerLinks}>
        <a href="#journey">Replay the show</a>
        <a href="#drop">Shop the drop</a>
        <span>© 2026 G Theta</span>
      </div>
    </footer>
  )
}

export function TheatreExperience() {
  const [entered, setEntered] = useState(false)
  const [gateOpening, setGateOpening] = useState(false)
  const [journeyStatus, setJourneyStatus] = useState({ progress: 0, active: 0 })
  const { openCart } = useCart()

  useEffect(() => {
    document.documentElement.style.overflow = entered ? "" : "hidden"
    return () => { document.documentElement.style.overflow = "" }
  }, [entered])

  const updateJourney = useCallback((progress: number, active: number) => {
    setJourneyStatus((current) =>
      current.active === active && Math.abs(current.progress - progress) < 0.002
        ? current
        : { progress, active }
    )
  }, [])

  const enter = () => {
    if (gateOpening) return
    setGateOpening(true)
    window.setTimeout(() => {
      setEntered(true)
      document.querySelector("#journey")?.scrollIntoView({ behavior: "smooth" })
    }, 1250)
  }

  return (
    <div className={styles.experience}>
      <TheatreGate entered={entered} opening={gateOpening} onEnter={enter} />
      {entered && <JourneyHud progress={journeyStatus.progress} active={journeyStatus.active} onCart={openCart} />}
      <Soundscape entered={gateOpening || entered} />
      <TheatreJourney entered={entered} onProgress={updateJourney} />
      <IntervalShop />
      <ReactionHall />
      <Credits />
    </div>
  )
}
