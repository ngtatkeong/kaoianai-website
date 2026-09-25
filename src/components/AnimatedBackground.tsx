import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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
      mouse.targetOpacity = 0.15
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

    // Natural drifting data nodes (capped for 60/120fps efficiency)
    const particleCount = Math.min(Math.floor((width * height) / 26000), 38)
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
      const speed = Math.random() * 0.32 + 0.12
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius: Math.random() * 1.6 + 1.2,
        baseAlpha: Math.random() * 0.32 + 0.28,
        colorRgb: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        phase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.0012 + 0.0006,
      })
    }

    let lastTime = performance.now()
    const TWO_PI = Math.PI * 2
    const linkDist = 110
    const linkDistSq = linkDist * linkDist
    const repelRadius = 140

    // Smooth render loop with zero layout thrashing
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 2)
      lastTime = time

      // Fluid lerp for cursor coordinates & opacity
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.065
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.065
      mouse.currentOpacity += (mouse.targetOpacity - mouse.currentOpacity) * 0.05

      ctx.clearRect(0, 0, width, height)

      // 1. Draw smooth cursor spotlight & luminous aura directly in Canvas (0 DOM blur cost)
      if (mouse.currentOpacity > 0.02) {
        const glowRadius = 260
        const glowGrad = ctx.createRadialGradient(
          mouse.currentX, mouse.currentY, 0,
          mouse.currentX, mouse.currentY, glowRadius
        )
        glowGrad.addColorStop(0, `rgba(168, 85, 247, ${0.16 * mouse.currentOpacity})`)
        glowGrad.addColorStop(0.35, `rgba(124, 58, 237, ${0.08 * mouse.currentOpacity})`)
        glowGrad.addColorStop(0.65, `rgba(99, 102, 241, ${0.03 * mouse.currentOpacity})`)
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.fillRect(
          mouse.currentX - glowRadius, mouse.currentY - glowRadius,
          glowRadius * 2, glowRadius * 2
        )

        const coreRadius = 85
        const coreGrad = ctx.createRadialGradient(
          mouse.currentX, mouse.currentY, 0,
          mouse.currentX, mouse.currentY, coreRadius
        )
        coreGrad.addColorStop(0, `rgba(192, 132, 252, ${0.25 * mouse.currentOpacity})`)
        coreGrad.addColorStop(0.5, `rgba(147, 51, 234, ${0.10 * mouse.currentOpacity})`)
        coreGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = coreGrad
        ctx.fillRect(
          mouse.currentX - coreRadius, mouse.currentY - coreRadius,
          coreRadius * 2, coreRadius * 2
        )
      }

      // 2. Calculate temporary display positions with natural hydrodynamic deflection
      const renderCoords: { x: number; y: number; alpha: number; radius: number; colorRgb: string }[] = []

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Organic harmonic drifting (sine wave sway)
        const swayX = Math.cos(time * p.swaySpeed + p.phase) * 0.16
        const swayY = Math.sin(time * p.swaySpeed + p.phase) * 0.16

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
        const distSqToMouse = dx * dx + dy * dy

        let dispX = 0
        let dispY = 0
        let proximityBoost = 0

        if (distSqToMouse < repelRadius * repelRadius && distSqToMouse > 0.01) {
          const distToMouse = Math.sqrt(distSqToMouse)
          const factor = Math.pow(1 - distToMouse / repelRadius, 2)
          dispX = (dx / distToMouse) * factor * 30
          dispY = (dy / distToMouse) * factor * 30
          proximityBoost = factor * 0.4
        }

        const drawX = p.x + dispX
        const drawY = p.y + dispY
        const drawAlpha = Math.min(p.baseAlpha + proximityBoost, 0.88)
        const drawRadius = p.radius * (1 + proximityBoost * 0.5)

        renderCoords.push({
          x: drawX,
          y: drawY,
          alpha: drawAlpha,
          radius: drawRadius,
          colorRgb: p.colorRgb,
        })
      }

      // 3. Draw elegant particle-to-particle links (skipping Math.sqrt when out of range)
      ctx.lineWidth = 0.8
      for (let i = 0; i < renderCoords.length; i++) {
        const c1 = renderCoords[i]
        for (let j = i + 1; j < renderCoords.length; j++) {
          const c2 = renderCoords[j]
          const dx = c1.x - c2.x
          const dy = c1.y - c2.y
          const distSq = dx * dx + dy * dy

          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq)
            const linkAlpha = Math.pow(1 - dist / linkDist, 1.6) * 0.20
            ctx.beginPath()
            ctx.moveTo(c1.x, c1.y)
            ctx.lineTo(c2.x, c2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${linkAlpha})`
            ctx.stroke()
          }
        }
      }

      // 4. Draw luminous nodes
      for (let i = 0; i < renderCoords.length; i++) {
        const c = renderCoords[i]
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.radius, 0, TWO_PI)
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
      {/* High-Performance Static Grid Pattern (cached as GPU texture) */}
      <div className="absolute inset-0 animated-grid-bg opacity-75" />

      {/* Ambient Gradient Glows (Native radial gradients, zero CSS blur filter overhead) */}
      <div 
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(124, 58, 237, 0.05) 45%, transparent 70%)',
        }}
      />
      <div 
        className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, rgba(147, 51, 234, 0.04) 45%, transparent 70%)',
        }}
      />
      <div 
        className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, rgba(124, 58, 237, 0.04) 45%, transparent 70%)',
        }}
      />

      {/* Natural Data Constellation & Cursor Glow Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}
