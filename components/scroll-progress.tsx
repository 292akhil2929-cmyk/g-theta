"use client"

import { motion, useScroll, useSpring } from "motion/react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[85] h-[3px] origin-left rounded-r-full"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #d83a2e, #f5cb45)",
        boxShadow: "0 0 12px rgba(216,58,46,0.6), 0 0 28px rgba(245,203,69,0.3)",
      }}
    />
  )
}
