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

    // Smooth lerp mouse tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isActive: false,
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.isActive = true

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        spotlightRef.current.style.opacity = '1'
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        auraRef.current.style.opacity = '0.85'
      }
    }

    const handleMouseLeave = () => {
      mouse.isActive = false
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0.3'
      if (auraRef.current) auraRef.current.style.opacity = '0.3'
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mouse.targetX = touch.clientX
        mouse.targetY = touch.clientY
        mouse.isActive = true
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${touch.clientX}px, ${touch.clientY}px, 0)`
          spotlightRef.current.style.opacity = '0.9'
        }
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

    // Dynamic data governance particles
    const particleCount = Math.min(Math.floor((width * height) / 16000), 60)
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseAlpha: number
      color: string
    }

    const colors = [
      'rgba(147, 51, 234, ',   // Purple-600
      'rgba(124, 58, 237, ',   // Violet-600
      'rgba(79, 70, 229, ',    // Indigo-600
      'rgba(20, 184, 166, ',   // Teal-500
      'rgba(217, 70, 239, ',   // Fuchsia-500
    ]

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Animation frame loop
    const render = () => {
      // Smooth lerp to cursor position
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Interaction with mouse cursor
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distToMouse = Math.sqrt(dx * dx + dy * dy)
        const maxMouseDist = 180

        let mouseFactor = 0
        if (distToMouse < maxMouseDist) {
          mouseFactor = 1 - distToMouse / maxMouseDist
          // Subtle attraction towards the cursor
          p.x += (dx / distToMouse) * mouseFactor * 0.6
          p.y += (dy / distToMouse) * mouseFactor * 0.6
        }

        // Draw particle dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * (1 + mouseFactor * 0.9), 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(p.baseAlpha + mouseFactor * 0.5, 0.9)})`
        ctx.fill()

        // Connect nearby particles with luminous data threads
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          const linkDist = 120
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.28 * (1 + mouseFactor * 1.2)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Connect particle directly to the mouse cursor if nearby
        if (distToMouse < 150) {
          const mouseLineAlpha = (1 - distToMouse / 150) * 0.45
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(168, 85, 247, ${mouseLineAlpha})`
          ctx.lineWidth = 1.3
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

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
      <div className="absolute inset-0 animated-grid-bg opacity-85" />

      {/* Floating Animated Luminous Ambient Orbs */}
      {/* Orb 1: Violet/Purple glow drifting top-right */}
      <div 
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-500/25 via-indigo-500/20 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 2: Deep Indigo glow orbiting top-left */}
      <div 
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-400/15 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Orb 3: Emerald / Cyan security glow pulsing in mid-viewport */}
      <div 
        className="absolute top-1/2 right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-teal-400/20 via-purple-400/15 to-transparent blur-3xl animate-pulse-glow"
      />

      {/* Orb 4: Warm Magenta / Violet accent drifting across lower sections */}
      <div 
        className="absolute top-3/4 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/15 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 5: Luminous base flare near footer */}
      <div 
        className="absolute -bottom-32 right-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-t from-indigo-500/20 via-purple-400/15 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Interactive Mouse-Following Spotlight Aura */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none transition-opacity duration-300 ease-out opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.24) 0%, rgba(124, 58, 237, 0.14) 30%, rgba(79, 70, 229, 0.08) 55%, transparent 75%)',
          filter: 'blur(32px)',
          willChange: 'transform',
        }}
      />

      {/* Tight Inner Cursor Glow */}
      <div
        ref={auraRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full pointer-events-none transition-opacity duration-200 ease-out opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, rgba(147, 51, 234, 0.18) 50%, transparent 80%)',
          filter: 'blur(16px)',
          willChange: 'transform',
        }}
      />

      {/* Interactive Neural Canvas: Connected Nodes tracking mouse */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

