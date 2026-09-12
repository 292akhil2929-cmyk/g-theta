"use client"

import { useEffect, useRef, type MutableRefObject } from "react"
import * as THREE from "three"

export type TheatreCamera = { yaw: number; pitch: number; progress: number; entered: boolean; paused: boolean; reduced: boolean }
export type TheatrePoint = { id: string; room: number; yaw: number; pitch: number }
export const THEATRE_POINTS: TheatrePoint[] = [
  { id: "door", room: 0, yaw: 0, pitch: -.12 },
  { id: "snacks", room: 1, yaw: -.82, pitch: -.08 },
  { id: "merch", room: 1, yaw: .88, pitch: -.08 },
  { id: "screen", room: 1, yaw: 0, pitch: -.05 },
  { id: "collection", room: 2, yaw: .72, pitch: -.05 },
]
const SOURCES = ["/images/360/forecourt.webp", "/images/360/lobby.webp", "/images/360/auditorium.webp"]

export function TheatreWorld({ control, onReady, onError, points }: {
  control: MutableRefObject<TheatreCamera>
  onReady: () => void
  onError: () => void
  points: MutableRefObject<Record<string, HTMLButtonElement | null>>
}) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mount = host.current
    if (!mount) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }) }
    catch { onError(); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor("#20120a")
    renderer.domElement.setAttribute("aria-label", "Interactive panoramic theatre")
    mount.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(76, 1, .1, 120)
    camera.rotation.order = "YXZ"
    const sphere = new THREE.SphereGeometry(60, 64, 40)
    sphere.scale(-1, 1, 1)
    const materials = SOURCES.map(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    const rooms = materials.map((material, index) => {
      const mesh = new THREE.Mesh(sphere, material)
      mesh.rotation.y = -Math.PI / 2 - (index === 2 ? .7 : 0)
      mesh.renderOrder = index
      scene.add(mesh)
      return mesh
    })
    let disposed = false
    const textures: THREE.Texture[] = []
    let loaded = 0
    SOURCES.forEach((src, index) => {
      new THREE.TextureLoader().load(src, texture => {
        if (disposed) { texture.dispose(); return }
        texture.colorSpace = THREE.SRGBColorSpace
        // The lobby is reflected so its principal snack counter sits to the left.
        if (index === 1) { texture.wrapS = THREE.RepeatWrapping; texture.repeat.x = -1 }
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
        textures.push(texture)
        materials[index].map = texture
        materials[index].needsUpdate = true
        loaded++
        if (loaded === SOURCES.length) onReady()
      }, undefined, () => { if (!disposed) onError() })
    })
    const count = window.innerWidth < 700 ? 65 : 135
    const paperGeometry = new THREE.PlaneGeometry(.055, .095)
    const paperMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: .86, depthWrite: false })
    const paper = new THREE.InstancedMesh(paperGeometry, paperMaterial, count)
    paper.renderOrder = 5
    const colors = ["#ffd633", "#ff4939", "#ef73ae", "#68afed", "#f9f2df"]
    const dummy = new THREE.Object3D()
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.sin(i * 13.7) * 5, y: (i * .37) % 6 - 2, z: Math.cos(i * 2.3) * 5,
      speed: .3 + (i % 7) * .045, phase: i * 1.41,
    }))
    particles.forEach((_, i) => paper.setColorAt(i, new THREE.Color(colors[i % colors.length])))
    scene.add(paper)
    const fixtures: THREE.BufferGeometry[] = []
    const fixtureMaterials: THREE.Material[] = []
    const box = (parent: THREE.Group, size: [number, number, number], position: [number, number, number], color: string) => {
      const geometry = new THREE.BoxGeometry(...size)
      const material = new THREE.MeshBasicMaterial({ color })
      fixtures.push(geometry); fixtureMaterials.push(material)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...position); parent.add(mesh)
      return mesh
    }
    // Hinged admission gates occupy the foreground, with the theatre visible between the rails.
    const gates = [-1, 1].map(side => {
      const group = new THREE.Group()
      group.position.set(side * 1.75, -.15, -2.7)
      for (let i = 0; i < 9; i++) box(group, [.016, 2.65, .04], [-side * i * .205, 0, 0], "#302719")
      for (const y of [-1.2, -.65, .62, 1.22]) box(group, [1.7, .035, .05], [-side * .84, y, 0], "#655032")
      scene.add(group)
      return group
    })
    const wardrobe = new THREE.Group()
    wardrobe.position.set(Math.sin(.88) * 7, .05, -Math.cos(.88) * 7)
    wardrobe.rotation.y = -.88
    box(wardrobe, [3.3, 2.8, .12], [0, .25, -.11], "#23180f")
    box(wardrobe, [3.35, .065, .18], [0, 1.64, 0], "#e7bb58")
    box(wardrobe, [.055, 2.8, .18], [-1.65, .25, 0], "#b08a47")
    box(wardrobe, [.055, 2.8, .18], [1.65, .25, 0], "#b08a47")
    for (const x of [-1.55, 1.55]) {
      box(wardrobe, [.065, 2.4, .09], [x, -2.3, -.05], "#4c3924")
      box(wardrobe, [.5, .06, .55], [x, -3.47, .05], "#332719")
    }
    ;["supplied-01.jpeg", "supplied-02.jpeg", "supplied-03.jpeg"].forEach((name, i) => {
      new THREE.TextureLoader().load(`/images/products/${name}`, texture => {
        if (disposed) { texture.dispose(); return }
        texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture)
        const geometry = new THREE.PlaneGeometry(.98, 1.65)
        const material = new THREE.MeshBasicMaterial({ map: texture })
        fixtures.push(geometry); fixtureMaterials.push(material)
        const photo = new THREE.Mesh(geometry, material)
        photo.position.set((i - 1) * 1.07, .3, 0)
        wardrobe.add(photo)
      })
    })
    scene.add(wardrobe)
    const point = new THREE.Vector3()
    const direction = new THREE.Vector3()
    let width = 1, height = 1, frame = 0, last = performance.now(), p = 0, yaw = 0, pitch = 0, gateOpen = 0
    let wasHidden = false
    const resize = () => {
      width = mount.clientWidth; height = mount.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()
    const render = (now: number) => {
      frame = requestAnimationFrame(render)
      if (document.hidden) { wasHidden = true; return }
      const dt = wasHidden ? 0 : Math.min((now - last) / 1000, .05)
      wasHidden = false; last = now
      const c = control.current
      const ease = c.reduced ? 1 : 1 - Math.exp(-dt * 7)
      p += (c.progress - p) * ease
      yaw += (c.yaw - yaw) * ease
      pitch += (c.pitch - pitch) * ease
      gateOpen += ((c.entered ? 1 : 0) - gateOpen) * (c.reduced ? 1 : 1 - Math.exp(-dt * 2.8))
      gates.forEach((gate, i) => { gate.rotation.y = (i === 0 ? -1 : 1) * gateOpen * Math.PI * .63; gate.visible = gateOpen < .995 })
      wardrobe.visible = Math.abs(p - 1) < .14
      const base = Math.min(2, Math.floor(p))
      const fraction = p - base
      const blend = THREE.MathUtils.smoothstep(fraction, .25, .8)
      materials.forEach((mat, i) => {
        mat.opacity = i === base ? 1 : i === base + 1 ? blend : 0
        rooms[i].visible = mat.opacity > .001
      })
      camera.rotation.y = -yaw
      camera.rotation.x = pitch
      camera.fov = (width < 700 ? 84 : 76) - (c.reduced ? 0 : Math.sin(fraction * Math.PI) * 22)
      camera.updateProjectionMatrix()
      paper.visible = !c.reduced
      if (!c.paused && !c.reduced) particles.forEach((item, i) => {
        item.y -= dt * item.speed
        if (item.y < -2.6) item.y = 3.6
        dummy.position.set(item.x + Math.sin(now * .0007 + item.phase) * .3, item.y, item.z)
        dummy.rotation.set(now * .0006 + item.phase, now * .0004 + item.phase, item.phase)
        dummy.updateMatrix()
        paper.setMatrixAt(i, dummy.matrix)
      })
      paper.instanceMatrix.needsUpdate = true
      camera.updateMatrixWorld()
      camera.getWorldDirection(direction)
      THEATRE_POINTS.forEach(h => {
        const el = points.current[h.id]
        if (!el) return
        point.set(Math.sin(h.yaw) * Math.cos(h.pitch), Math.sin(h.pitch), -Math.cos(h.yaw) * Math.cos(h.pitch))
        const visible = c.entered && Math.abs(p - h.room) < .12 && point.dot(direction) > .2
        point.multiplyScalar(10).project(camera)
        const inside = visible && Math.abs(point.x) < .93 && Math.abs(point.y) < .75
        el.style.visibility = inside ? "visible" : "hidden"
        el.style.transform = `translate(-50%, -50%) translate(${(point.x * .5 + .5) * width}px, ${(-point.y * .5 + .5) * height}px)`
        el.tabIndex = inside ? 0 : -1
      })
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(render)
    const lost = (event: Event) => { event.preventDefault(); onError() }
    renderer.domElement.addEventListener("webglcontextlost", lost)
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect()
      renderer.domElement.removeEventListener("webglcontextlost", lost)
      sphere.dispose(); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose())
      fixtures.forEach(g => g.dispose()); fixtureMaterials.forEach(m => m.dispose())
      paperGeometry.dispose(); paperMaterial.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [control, onReady, onError, points])
  return <div ref={host} style={{ position: "absolute", inset: 0 }} />
}
