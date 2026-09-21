export default function AnimatedBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Dynamic Animated Grid Pattern */}
      <div className="absolute inset-0 animated-grid-bg opacity-70" />

      {/* Floating Animated Luminous Orbs */}
      {/* Orb 1: Violet/Purple glow drifting top-right */}
      <div 
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-purple-400/20 via-indigo-400/15 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 2: Deep Indigo glow orbiting top-left */}
      <div 
        className="absolute top-1/4 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-400/15 via-purple-300/10 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Orb 3: Subtle Emerald / Cyan security glow pulsing in mid-viewport */}
      <div 
        className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-teal-400/12 via-purple-400/10 to-transparent blur-3xl animate-pulse-glow"
      />

      {/* Orb 4: Warm Violet / Magenta accent drifting across lower sections */}
      <div 
        className="absolute top-3/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/15 via-pink-400/10 to-transparent blur-3xl animate-float-slow"
      />

      {/* Orb 5: Luminous base flare near footer */}
      <div 
        className="absolute -bottom-32 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-indigo-500/15 via-purple-400/10 to-transparent blur-3xl animate-float-reverse"
      />

      {/* Soft Vignette Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />
    </div>
  )
}
