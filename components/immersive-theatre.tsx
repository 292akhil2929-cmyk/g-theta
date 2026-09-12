"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight, Check, Compass, Pause, Play, Popcorn, RotateCcw, ShoppingBag, Volume2, VolumeX, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"
import { products, type Product } from "@/lib/products"
import { THEATRE_POINTS, type TheatreCamera } from "./theatre-world"
import styles from "./immersive-theatre.module.css"

const World = dynamic(() => import("./theatre-world").then(m => m.TheatreWorld), { ssr: false })
const ROOMS = ["Forecourt", "Interval", "First show"]
const LABELS: Record<string, string> = { door: "Enter the theatre", snacks: "Interval break", merch: "The wardrobe", screen: "Find your seat", collection: "Wear the reaction" }
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product, size: string) => void }) {
  const [size, setSize] = useState("L")
  const [imageIndex, setImageIndex] = useState(0)
  return <article className={styles.product}>
    <div className={styles.productImage}>
      <Image src={product.images?.[imageIndex] || "/images/products/supplied-01.jpeg"} alt={product.name} fill sizes="(max-width: 700px) 85vw, 360px" />
      {(product.images?.length || 0) > 1 && <button className={styles.reverse} onClick={() => setImageIndex(i => i === 0 ? 1 : 0)} aria-label={`View other side of ${product.name}`}><RotateCcw size={16} /> Other side</button>}
    </div>
    <div className={styles.productTitle}><h3>{product.name}</h3><span>₹{product.price.toLocaleString("en-IN")}</span></div>
    <div className={styles.sizes} role="group" aria-label={`Size for ${product.name}`}>
      {product.sizes.map(s => <button key={s} aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>)}
    </div>
    <button className={styles.add} onClick={() => onAdd(product, size)}>Add to bag <ArrowRight size={18} /></button>
  </article>
}

export function ImmersiveTheatre() {
  const reduced = useReducedMotion()
  const [entered, setEntered] = useState(false)
  const [ready, setReady] = useState(false)
  const [fallback, setFallback] = useState(false)
  const [room, setRoom] = useState(0)
  const [sound, setSound] = useState(true)
  const [paused, setPaused] = useState(false)
  const [panel, setPanel] = useState<"shop" | "snacks" | null>(null)
  const [hint, setHint] = useState(true)
  const [notice, setNotice] = useState("")
  const [query, setQuery] = useState("")
  const main = useRef<HTMLElement>(null)
  const shop = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const audioEnded = useRef(false)
  const hotspots = useRef<Record<string, HTMLButtonElement | null>>({})
  const control = useRef<TheatreCamera>({ yaw: 0, pitch: .06, progress: 0, entered: false, paused: false, reduced: false })
  const drag = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  const { addItem, openCart, totalCount, isOpen: cartOpen } = useCart()
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => { setFallback(true); setReady(true) }, [])
  const go = useCallback((value: number) => {
    const next = clamp(value, 0, 2)
    control.current.progress = next
    control.current.yaw = 0
    control.current.pitch = .025
    setRoom(Math.round(next))
    setHint(false)
  }, [])

  useEffect(() => { control.current.reduced = !!reduced; control.current.paused = paused || !!panel || cartOpen }, [reduced, paused, panel, cartOpen])
  useEffect(() => {
    if (!fallback) return
    THEATRE_POINTS.forEach(point => {
      const el = hotspots.current[point.id]
      if (el) { el.style.transform = "translate(-50%, -50%)"; el.tabIndex = point.room === room ? 0 : -1 }
    })
  }, [fallback, room, entered])
  useEffect(() => {
    const el = main.current
    if (!el) return
    const wheel = (e: WheelEvent) => {
      if (!control.current.entered || panel || cartOpen) return
      e.preventDefault()
      setHint(false)
      const next = clamp(control.current.progress + clamp(e.deltaY, -180, 180) * .0015, 0, 2)
      control.current.progress = next
      control.current.yaw *= .9
      control.current.pitch *= .9
      setRoom(Math.round(next))
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => el.removeEventListener("wheel", wheel)
  }, [panel, cartOpen])
  useEffect(() => {
    if (!panel) return
    previousFocus.current = document.activeElement as HTMLElement
    shop.current?.querySelector<HTMLButtonElement>("button")?.focus()
    return () => previousFocus.current?.focus()
  }, [panel])
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(""), 3500)
    return () => clearTimeout(timer)
  }, [notice])

  const startAudio = () => {
    const el = audio.current
    if (!el || audioEnded.current) return
    if (el.currentTime < 20) el.currentTime = 20
    el.volume = .65
    void el.play().then(() => setSound(true)).catch(() => { setSound(false); setNotice("Tap the speaker to start the soundtrack.") })
  }
  const enter = () => {
    setEntered(true); control.current.entered = true
    if (sound) startAudio()
    main.current?.focus()
  }
  const toggleAudio = () => {
    if (sound && audio.current && !audio.current.paused) { audio.current.pause(); setSound(false) }
    else if (audioEnded.current) { setNotice("The entry soundtrack has finished."); setSound(false) }
    else if (!entered) setSound(s => !s)
    else startAudio()
  }
  const pointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!entered || panel || cartOpen || (e.target as HTMLElement).closest("button, nav, input")) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { active: true, x: e.clientX, y: e.clientY, yaw: control.current.yaw, pitch: control.current.pitch }
    setHint(false)
  }
  const pointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current.active) return
    control.current.yaw = drag.current.yaw - (e.clientX - drag.current.x) * .0038
    control.current.pitch = clamp(drag.current.pitch + (e.clientY - drag.current.y) * .0028, -.95, .95)
  }
  const keyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (panel) {
      if (e.key === "Escape") setPanel(null)
      if (e.key === "Tab") {
        const all = shop.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, [tabindex="0"]')
        if (!all?.length) return
        const first = all[0], last = all[all.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
      return
    }
    if (!entered || cartOpen || (e.target as HTMLElement).closest("button,input")) return
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageDown", "PageUp", "Home"].includes(e.key)) e.preventDefault()
    if (e.key === "ArrowLeft") control.current.yaw -= .18
    if (e.key === "ArrowRight") control.current.yaw += .18
    if (e.key === "ArrowUp") control.current.pitch = clamp(control.current.pitch + .12, -.95, .95)
    if (e.key === "ArrowDown") control.current.pitch = clamp(control.current.pitch - .12, -.95, .95)
    if (e.key === "PageDown") go(room + 1)
    if (e.key === "PageUp") go(room - 1)
    if (e.key === "Home") go(0)
  }
  const hotspotAction = (id: string) => {
    if (id === "door") go(1)
    else if (id === "screen") go(2)
    else setPanel(id === "snacks" ? "snacks" : "shop")
  }
  return <MotionConfig reducedMotion="user"><main ref={main} className={styles.experience} tabIndex={-1}
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current.active = false }} onPointerCancel={() => { drag.current.active = false }} onKeyDown={keyDown} aria-label="G Theta interactive theatre">
    <audio ref={audio} src="/audio/adaraku-entry.mp3" preload="auto" playsInline onLoadedMetadata={e => { e.currentTarget.currentTime = Math.min(20, e.currentTarget.duration) }} onEnded={() => { audioEnded.current = true; setSound(false) }} onError={() => { setSound(false); setNotice("Soundtrack unavailable. You can still explore.") }} />
    <div className={styles.world} style={{ backgroundImage: `url(/images/360/${["forecourt", "lobby", "auditorium"][room]}.webp)` }}>
      {!fallback && <World control={control} points={hotspots} onReady={onReady} onError={onError} />}
    </div>
    <div className={styles.vignette} aria-hidden />
    <div className={styles.topbar} inert={!!panel}>
      <button className={styles.brand} onClick={() => go(0)} aria-label="Return to forecourt"><Logo /></button>
      <div className={styles.actions}>
        <button onClick={toggleAudio} aria-label={sound ? "Mute soundtrack" : "Play soundtrack"}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
        {entered && <button onClick={() => setPaused(p => !p)} aria-label={paused ? "Resume effects" : "Pause effects"}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>}
        <button className={styles.shopButton} aria-label="Open wardrobe" onClick={() => setPanel("shop")}><ShoppingBag size={17} /><span>Wardrobe</span></button>
        <button onClick={openCart} aria-label={`Open bag, ${totalCount} items`} className={styles.bagCount}>{totalCount}</button>
      </div>
    </div>
    <AnimatePresence>
      {!entered && <motion.div className={styles.admission} exit={{ opacity: 0, y: reduced ? 0 : 45 }} transition={{ duration: .65 }}>
        <button onClick={enter} className={styles.ticket} disabled={!ready} aria-label="Enter the theatre">
          <span className={styles.ticketStub}><span>G Θ</span><small>70 MM</small></span>
          <span className={styles.ticketMain}><strong>{ready ? "ENTER THE THEATRE" : "OPENING THE GATES"}</strong><span>{ready ? "Your first show starts here." : "Setting the scene…"}</span></span>
          <ArrowRight size={26} />
        </button>
        <p>HYDERABAD. HOUSE FULL. ALL HEART.</p>
      </motion.div>}
    </AnimatePresence>
    {entered && <>
      <div className={styles.hotspots} inert={!!panel}>
        {THEATRE_POINTS.map(point => <button key={point.id} ref={el => { hotspots.current[point.id] = el }} className={styles.hotspot} style={fallback ? { visibility: point.room === room ? "visible" : "hidden", left: point.id === "snacks" ? "20%" : point.id === "merch" ? "80%" : "50%", top: "48%" } : undefined} onClick={() => hotspotAction(point.id)}>
          <span>{point.id === "snacks" ? <Popcorn size={20} /> : ["merch", "collection"].includes(point.id) ? <ShoppingBag size={20} /> : <ArrowRight size={20} />}</span><b>{LABELS[point.id]}</b>
        </button>)}
      </div>
      <div className={styles.bottom} inert={!!panel}>
        <div className={styles.lookHint}>{hint ? <><Compass size={17} /><span>Drag to look around<br /><small>Scroll to step inside</small></span></> : <><Compass size={17} /><span>{ROOMS[room]}<br /><small>Drag to explore</small></span></>}</div>
        <nav className={styles.navigation} aria-label="Theatre rooms">{ROOMS.map((label, i) => <button key={label} aria-current={room === i ? "step" : undefined} onClick={() => go(i)}><i />{label}</button>)}</nav>
        <button className={styles.next} onClick={() => room < 2 ? go(room + 1) : setPanel("shop")}>{room < 2 ? "Step inside" : "Shop the drop"}<ArrowRight size={19} /></button>
      </div>
      <button className={styles.reset} aria-label="Recenter camera" onClick={() => { control.current.yaw = 0; control.current.pitch = .025 }}><RotateCcw size={16} /></button>
    </>}
    <AnimatePresence>{panel && <motion.div className={styles.panelBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div ref={shop} role="dialog" aria-modal="true" aria-label={panel === "shop" ? "G Theta wardrobe" : "Interval break"} className={styles.panel} initial={{ y: reduced ? 0 : "100%" }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : "100%" }} transition={{ type: "spring", stiffness: 180, damping: 30 }} data-lenis-prevent>
        <header className={styles.panelHeader}><button onClick={() => setPanel(null)} aria-label="Back to theatre"><ArrowLeft size={20} /></button><h2>{panel === "shop" ? "THE WARDROBE" : "INTERVAL"}</h2><button onClick={() => setPanel(null)} aria-label="Close wardrobe"><X size={22} /></button></header>
        {panel === "shop" ? <><div className={styles.shopIntro}><p>Same reaction.<br /><strong>New uniform.</strong></p><input type="search" placeholder="Find your reaction…" aria-label="Search hoodies" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <div className={styles.products}>{products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(product => <ProductCard key={product.id} product={product} onAdd={(p, size) => { setPanel(null); addItem(p, size) }} />)}</div>
          {!products.some(p => p.name.toLowerCase().includes(query.toLowerCase())) && <p className={styles.empty}>No hoodies match that search. Try another reaction.</p>}
        </> : <div className={styles.interval}><Popcorn size={64} /><h3>Popcorn first.<br />Hero entry next.</h3><p>Take a breath. The first show is waiting.</p><button className={styles.add} onClick={() => { setPanel(null); go(2) }}>Back to the show <ArrowRight size={20} /></button><button className={styles.intervalShop} onClick={() => setPanel("shop")}>Take a look at the wardrobe</button></div>}
      </motion.div>
    </motion.div>}</AnimatePresence>
    <div className={styles.notice} role="status" aria-live="polite">{notice && <><Check size={16} />{notice}</>}</div>
    <span className={styles.srOnly}>Use arrow keys to look around, Page Down and Page Up to change rooms. The wardrobe contains the merchandise.</span>
  </main></MotionConfig>
}
