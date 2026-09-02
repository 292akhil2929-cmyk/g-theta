"use client"

import Image from "next/image"
import { Canvas, useFrame } from "@react-three/fiber"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Expand,
  Hand,
  ShoppingBag,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import * as THREE from "three"
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"
import { products, type Product } from "@/lib/products"
import styles from "./immersive-theatre.module.css"

const ROOMS = [
  { id: "forecourt", texture: "/images/360/forecourt.webp", tone: "#ecb62d" },
  { id: "lobby", texture: "/images/360/lobby.webp", tone: "#ef3b2f" },
  { id: "auditorium", texture: "/images/360/auditorium.webp", tone: "#f6d443" },
] as const

const PAPER_COLORS = ["#ef3b2f", "#f6d443", "#256df5", "#fa2f91", "#f7efe0", "#71cf35"]

type Look = { yaw: number; pitch: number; fov: number }

function CameraRig({ look }: { look: MutableRefObject<Look> }) {
  useFrame(({ camera }) => {
    camera.rotation.order = "YXZ"
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, look.current.yaw, 0.1)
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, look.current.pitch, 0.1)
    const perspective = camera as THREE.PerspectiveCamera
    perspective.fov = THREE.MathUtils.lerp(perspective.fov, look.current.fov, 0.08)
    perspective.updateProjectionMatrix()
  })
  return null
}

type PaperDatum = {
  x: number
  y: number
  z: number
  speed: number
  spin: number
  phase: number
  size: number
  color: string
}

function PaperCelebration({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  const paper = useMemo<PaperDatum[]>(
    () =>
      Array.from({ length: 58 }, (_, index) => ({
        x: -8 + ((index * 71) % 160) / 10,
        y: -4 + ((index * 37) % 85) / 10,
        z: -12 + ((index * 43) % 190) / 10,
        speed: 0.25 + (index % 8) * 0.055,
        spin: 0.55 + (index % 7) * 0.18,
        phase: (index * 1.73) % Math.PI,
        size: 0.13 + (index % 5) * 0.045,
        color: PAPER_COLORS[index % PAPER_COLORS.length],
      })),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current || !active) return
    group.current.visible = active
    group.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh
      const item = paper[index]
      mesh.position.y -= delta * item.speed
      mesh.position.x += Math.sin(state.clock.elapsedTime * 0.9 + item.phase) * delta * 0.16
      mesh.rotation.x += delta * item.spin
      mesh.rotation.y += delta * item.spin * 0.7
      mesh.rotation.z += delta * item.spin * 0.4
      if (mesh.position.y < -4.8) mesh.position.y = 5.2
    })
  })

  return (
    <group ref={group} visible={active}>
      {paper.map((item, index) => (
        <mesh key={index} position={[item.x, item.y, item.z]} rotation={[item.phase, item.phase, 0]}>
          <planeGeometry args={[item.size, item.size * 1.45]} />
          <meshBasicMaterial color={item.color} side={THREE.DoubleSide} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  )
}

function Dust({ active }: { active: boolean }) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const array = new Float32Array(210 * 3)
    for (let i = 0; i < 210; i += 1) {
      array[i * 3] = -9 + ((i * 79) % 180) / 10
      array[i * 3 + 1] = -4 + ((i * 31) % 90) / 10
      array[i * 3 + 2] = -10 + ((i * 59) % 200) / 10
    }
    return array
  }, [])

  useFrame((state) => {
    if (points.current && active) points.current.rotation.y = state.clock.elapsedTime * 0.008
  })

  return (
    <points ref={points} visible={active}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffd96a" size={0.018} transparent opacity={0.46} sizeAttenuation />
    </points>
  )
}

function World({ room, look }: { room: number; look: MutableRefObject<Look> }) {
  return (
    <>
      <CameraRig look={look} />
      <Dust active={room > 0} />
      <PaperCelebration active={room === 2} />
    </>
  )
}

function Entry({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div className={styles.entry} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className={styles.entryBackdrop} />
      <motion.div
        className={styles.entryMark}
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo />
      </motion.div>
      <button className={styles.enter} onClick={onEnter} aria-label="Enter the theatre">
        <span />
        <ChevronDown size={26} strokeWidth={2.4} />
      </button>
    </motion.div>
  )
}

function ProductTile({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <article className={styles.product}>
      <div>
        {product.images?.[0] && (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 700px) 75vw, 280px" />
        )}
      </div>
      <footer>
        <span>{product.name}</span>
        <button onClick={() => addItem(product, "L")} aria-label={`Add ${product.name} to bag`}>
          ₹{product.price.toLocaleString("en-IN")} <span>+</span>
        </button>
      </footer>
    </article>
  )
}

function ShopPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className={styles.shop}
          initial={{ x: "105%" }}
          animate={{ x: 0 }}
          exit={{ x: "105%" }}
          transition={{ type: "spring", damping: 32, stiffness: 280 }}
        >
          <header>
            <Logo />
            <button onClick={onClose} aria-label="Close shop"><X /></button>
          </header>
          <div className={styles.products}>
            {products.slice(0, 6).map((product) => <ProductTile key={product.id} product={product} />)}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export function ImmersiveTheatre() {
  const experienceRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const [room, setRoom] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [shopOpen, setShopOpen] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const look = useRef<Look>({ yaw: 0, pitch: 0, fov: 72 })
  const drag = useRef({ active: false, moved: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  const wheelLock = useRef(false)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { openCart, totalCount } = useCart()

  const playSound = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !soundOn) return
    if (audio.duration > 22 && audio.currentTime < 19.5) audio.currentTime = 20
    void audio.play().catch(() => undefined)
  }, [soundOn])

  const enter = () => {
    setEntered(true)
    window.setTimeout(playSound, 80)
  }

  const goToRoom = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(ROOMS.length - 1, next))
    if (bounded === room || transitioning) return
    setTransitioning(true)
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => {
      setRoom(bounded)
      look.current = { ...look.current, yaw: 0, pitch: 0, fov: bounded === 2 ? 77 : 72 }
      experienceRef.current?.style.setProperty("--pano-x", "0px")
      experienceRef.current?.style.setProperty("--pano-y", "0px")
      window.setTimeout(() => setTransitioning(false), 320)
    }, 430)
  }, [room, transitioning])

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!entered || shopOpen) return
    if (event.ctrlKey) {
      look.current.fov = THREE.MathUtils.clamp(look.current.fov + event.deltaY * 0.03, 48, 90)
      return
    }
    if (Math.abs(event.deltaY) < 18 || wheelLock.current) return
    wheelLock.current = true
    goToRoom(room + (event.deltaY > 0 ? 1 : -1))
    window.setTimeout(() => { wheelLock.current = false }, 900)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!entered || shopOpen) return
    if ((event.target as Element).closest("button, aside")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      active: true,
      moved: false,
      x: event.clientX,
      y: event.clientY,
      yaw: look.current.yaw,
      pitch: look.current.pitch,
    }
    setHintVisible(false)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || transitioning) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    drag.current.moved ||= Math.abs(dx) + Math.abs(dy) > 5
    look.current.yaw = drag.current.yaw - dx * 0.0047
    look.current.pitch = THREE.MathUtils.clamp(drag.current.pitch - dy * 0.0037, -1.05, 1.05)
    experienceRef.current?.style.setProperty("--pano-x", `${look.current.yaw * 28}vw`)
    experienceRef.current?.style.setProperty("--pano-y", `${look.current.pitch * 9}vh`)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    drag.current.active = false
    if (Math.abs(dy) > 85 && Math.abs(dy) > Math.abs(dx) * 1.25) {
      goToRoom(room + (dy < 0 ? 1 : -1))
    }
  }

  const toggleSound = () => {
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

  useEffect(() => {
    const currentTimer = transitionTimer.current
    ROOMS.forEach((item) => {
      const image = new window.Image()
      image.src = item.texture
    })
    return () => { if (currentTimer) clearTimeout(currentTimer) }
  }, [])

  return (
    <main
      ref={experienceRef}
      className={styles.experience}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <audio
        ref={audioRef}
        src="/audio/adaraku-entry.mp3"
        preload="auto"
        playsInline
        onLoadedMetadata={(event) => {
          if (event.currentTarget.duration > 22) event.currentTarget.currentTime = 20
        }}
      />

      <div
        className={styles.panorama}
        style={{ backgroundImage: `url(${ROOMS[room].texture})` }}
        aria-hidden
      />

      <Suspense fallback={<div className={styles.loading}><Logo /></div>}>
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 0.01], fov: 72, near: 0.01, far: 60 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <World room={room} look={look} />
        </Canvas>
      </Suspense>

      <div className={styles.cinemaGrade} aria-hidden />
      <div className={`${styles.roomFade} ${transitioning ? styles.roomFadeActive : ""}`} aria-hidden />
      {room === 2 && <div className={styles.projectorFlicker} aria-hidden />}

      <AnimatePresence>{!entered && <Entry onEnter={enter} />}</AnimatePresence>

      {entered && (
        <>
          <header className={styles.hud}>
            <button className={styles.mark} onClick={() => goToRoom(0)} aria-label="Return to the entrance"><Logo /></button>
            <div className={styles.actions}>
              <button onClick={toggleSound} aria-label={soundOn ? "Mute soundtrack" : "Play soundtrack"}>
                {soundOn ? <Volume2 /> : <VolumeX />}
              </button>
              <button onClick={() => setShopOpen(true)} aria-label="Open merchandise room"><ShoppingBag /><b>{totalCount}</b></button>
              <button onClick={openCart} aria-label="Open shopping bag"><Expand /></button>
            </div>
          </header>

          <nav className={styles.roomNav} aria-label="Theatre rooms">
            {ROOMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToRoom(index)}
                className={index === room ? styles.roomActive : ""}
                aria-label={`Go to ${item.id}`}
                aria-current={index === room ? "step" : undefined}
                style={{ "--room-tone": item.tone } as React.CSSProperties}
              ><span /></button>
            ))}
          </nav>

          <button className={`${styles.step} ${styles.stepBack}`} onClick={() => goToRoom(room - 1)} disabled={room === 0} aria-label="Previous room"><ArrowLeft /></button>
          <button className={`${styles.step} ${styles.stepNext}`} onClick={() => goToRoom(room + 1)} disabled={room === ROOMS.length - 1} aria-label="Next room"><ArrowRight /></button>

          <AnimatePresence>
            {hintVisible && (
              <motion.div className={styles.hint} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Hand />
                <i />
              </motion.div>
            )}
          </AnimatePresence>

          {room === 1 && (
            <button className={styles.merchPortal} onClick={() => setShopOpen(true)} aria-label="Enter merchandise room">
              <span><ShoppingBag /></span>
            </button>
          )}
        </>
      )}

      <ShopPanel open={shopOpen} onClose={() => setShopOpen(false)} />
    </main>
  )
}
