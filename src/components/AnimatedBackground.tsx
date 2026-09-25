import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const spotlightRef = useRef<HTMLDivElement | null>(null)
  const auraRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Fluid mouse tracking with smooth organic lerp
    const mouse = {
      currentX: width / 2,
      currentY: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isActive: false,
      targetOpacity: 0.15,
      currentOpacity: 0.15,
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.isActive = true
      mouse.targetOpacity = 1
    }

    const handleMouseLeave = () => {
      mouse.isActive = false
      mouse.targetOpacity = 0.2
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mouse.targetX = touch.clientX
        mouse.targetY = touch.clientY
        mouse.isActive = true
        mouse.targetOpacity = 0.9
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Natural drifting data nodes
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55)
    interface Particle {
      x: number
      y: number
      baseVx: number
      baseVy: number
      radius: number
      baseAlpha: number
      colorRgb: string
      phase: number
      swaySpeed: number
    }

    const colorPalettes = [
      '147, 51, 234',  // Purple-600
      '124, 58, 237',  // Violet-600
      '99, 102, 241',  // Indigo-500
      '20, 184, 166',  // Teal-500
      '217, 70, 239',  // Fuchsia-500
    ]

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.35 + 0.15
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.35 + 0.3,
        colorRgb: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        phase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.0012 + 0.0006,
      })
    }

    let lastTime = performance.now()

    // Smooth 60fps render loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 2)
      lastTime = time

      // Fluid lerp for cursor coordinates & opacity (natural inertia)
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.065
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.065
      mouse.currentOpacity += (mouse.targetOpacity - mouse.currentOpacity) * 0.05

      // Update DOM cursor spotlight smoothly
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mouse.currentX}px, ${mouse.currentY}px, 0)`
        spotlightRef.current.style.opacity = `${mouse.currentOpacity}`
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${mouse.currentX}px, ${mouse.currentY}px, 0)`
        auraRef.current.style.opacity = `${mouse.currentOpacity * 0.9}`
      }

      ctx.clearRect(0, 0, width, height)

      // Calculate temporary display positions with natural hydrodynamic deflection
      const renderCoords: { x: number; y: number; alpha: number; radius: number; colorRgb: string }[] = []

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Organic harmonic drifting (sine wave sway)
        const swayX = Math.cos(time * p.swaySpeed + p.phase) * 0.18
        const swayY = Math.sin(time * p.swaySpeed + p.phase) * 0.18

        p.x += (p.baseVx + swayX) * dt
        p.y += (p.baseVy + swayY) * dt

        // Seamless wrap around edges
        const padding = 20
        if (p.x < -padding) p.x = width + padding
        if (p.x > width + padding) p.x = -padding
        if (p.y < -padding) p.y = height + padding
        if (p.y > height + padding) p.y = -padding

        // Natural elastic deflection from cursor (never clumps permanently)
        const dx = p.x - mouse.currentX
        const dy = p.y - mouse.currentY
        const distToMouse = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 150

        let dispX = 0
        let dispY = 0
        let proximityBoost = 0

        if (distToMouse < repelRadius && distToMouse > 0.1) {
          // Quadratic falloff: soft at edges, gentle spring near center
          const factor = Math.pow(1 - distToMouse / repelRadius, 2)
          dispX = (dx / distToMouse) * factor * 32
          dispY = (dy / distToMouse) * factor * 32
          proximityBoost = factor * 0.4
        }

        const drawX = p.x + dispX
        const drawY = p.y + dispY
        const drawAlpha = Math.min(p.baseAlpha + proximityBoost, 0.9)
        const drawRadius = p.radius * (1 + proximityBoost * 0.6)

        renderCoords.push({
          x: drawX,
          y: drawY,
          alpha: drawAlpha,
          radius: drawRadius,
          colorRgb: p.colorRgb,
        })
      }

      // Draw elegant particle-to-particle links
      const linkDist = 115
      for (let i = 0; i < renderCoords.length; i++) {
        const c1 = renderCoords[i]
        for (let j = i + 1; j < renderCoords.length; j++) {
          const c2 = renderCoords[j]
          const dist = Math.hypot(c1.x - c2.x, c1.y - c2.y)

          if (dist < linkDist) {
            // Natural quadratic fade curve
            const linkAlpha = Math.pow(1 - dist / linkDist, 1.8) * 0.22
            ctx.beginPath()
            ctx.moveTo(c1.x, c1.y)
            ctx.lineTo(c2.x, c2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${linkAlpha})`
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }
      }

      // Draw luminous nodes
      for (let i = 0; i < renderCoords.length; i++) {
        const c = renderCoords[i]
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.colorRgb}, ${c.alpha})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Dynamic Animated Grid Pattern */}
      <div className="absolute inset-0 animated-grid-bg opacity-75" />

      {/* Floating Animated Ambient Glows */}
      {/* Orb 1: Violet/Purple soft glow drifting top-right */}
      <div 
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-purple-400/20 via-indigo-400/15 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 2: Deep Indigo glow orbiting top-left */}
      <div 
        className="absolute top-1/4 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-400/15 via-purple-300/10 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Orb 3: Emerald / Cyan security glow pulsing in mid-viewport */}
      <div 
        className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-teal-400/15 via-purple-400/10 to-transparent blur-3xl animate-pulse-glow"
      />

      {/* Orb 4: Warm Magenta / Violet accent drifting across lower sections */}
      <div 
        className="absolute top-3/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-fuchsia-400/15 via-purple-400/10 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 5: Luminous base flare near footer */}
      <div 
        className="absolute -bottom-32 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-indigo-400/15 via-purple-300/10 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Fluid Cursor Spotlight (Smooth Trailing Glow) */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-500 ease-out opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(124, 58, 237, 0.10) 35%, rgba(79, 70, 229, 0.05) 60%, transparent 75%)',
          filter: 'blur(28px)',
          willChange: 'transform',
        }}
      />

      {/* Tight Luminous Cursor Core */}
      <div
        ref={auraRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none transition-opacity duration-300 ease-out opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.28) 0%, rgba(147, 51, 234, 0.12) 50%, transparent 80%)',
          filter: 'blur(14px)',
          willChange: 'transform',
        }}
      />

      {/* Natural Data Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

