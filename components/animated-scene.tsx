'use client'

import { useEffect, useState } from 'react'

interface AnimatedSceneProps {
  theme?: 'light' | 'dark'
  className?: string
}

export function AnimatedScene({ theme = 'light', className = '' }: AnimatedSceneProps) {
  const [mounted, setMounted] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Cycle through animation phases
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const isSunrise = theme === 'light'
  const sunPosition = Math.sin((animationPhase / 100) * Math.PI) * 60 + 20
  const skyGradient = isSunrise
    ? `linear-gradient(to bottom,
        hsl(${30 + animationPhase/2}, 80%, ${70 + animationPhase/4}%) 0%,
        hsl(${40 + animationPhase/3}, 85%, ${60 + animationPhase/5}%) 30%,
        hsl(${50 + animationPhase/4}, 90%, ${50 + animationPhase/6}%) 70%,
        hsl(${60 + animationPhase/5}, 95%, ${40 + animationPhase/8}%) 100%)`
    : `linear-gradient(to bottom,
        hsl(${220 - animationPhase/3}, 60%, ${20 - animationPhase/8}%) 0%,
        hsl(${240 - animationPhase/4}, 70%, ${15 - animationPhase/10}%) 30%,
        hsl(${260 - animationPhase/5}, 80%, ${10 - animationPhase/12}%) 70%,
        hsl(${280 - animationPhase/6}, 90%, ${8 - animationPhase/15}%) 100%)`

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Sky Background */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: skyGradient
        }}
      />

      {/* Mountains/Hills Silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full opacity-60"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
        >
          {/* Mountain layers */}
          <path
            d="M0,200 L0,120 L50,80 L100,100 L150,60 L200,90 L250,40 L300,70 L350,50 L400,80 L400,200 Z"
            fill={isSunrise ? 'rgba(139, 69, 19, 0.8)' : 'rgba(25, 25, 25, 0.9)'}
            className="transition-all duration-1000"
          />
          <path
            d="M0,200 L0,140 L60,110 L120,130 L180,100 L240,120 L300,90 L360,110 L400,100 L400,200 Z"
            fill={isSunrise ? 'rgba(101, 67, 33, 0.6)' : 'rgba(15, 15, 15, 0.7)'}
            className="transition-all duration-1000"
          />
          <path
            d="M0,200 L0,160 L80,140 L140,150 L200,130 L260,145 L320,135 L380,140 L400,135 L400,200 Z"
            fill={isSunrise ? 'rgba(76, 61, 41, 0.4)' : 'rgba(10, 10, 10, 0.5)'}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* Sun/Moon */}
      <div
        className="absolute w-16 h-16 rounded-full transition-all duration-200 ease-out"
        style={{
          left: `${20 + (animationPhase / 100) * 60}%`,
          top: `${sunPosition}%`,
          background: isSunrise
            ? `radial-gradient(circle,
                hsl(45, 100%, 85%) 0%,
                hsl(40, 100%, 75%) 30%,
                hsl(35, 100%, 65%) 70%,
                hsl(30, 100%, 55%) 100%)`
            : `radial-gradient(circle,
                hsl(210, 30%, 90%) 0%,
                hsl(220, 25%, 80%) 50%,
                hsl(230, 20%, 70%) 100%)`,
          boxShadow: isSunrise
            ? '0 0 40px rgba(255, 200, 100, 0.8), 0 0 80px rgba(255, 150, 50, 0.6)'
            : '0 0 30px rgba(200, 220, 255, 0.6), 0 0 60px rgba(150, 180, 255, 0.4)',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Animated Clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 transition-all duration-300"
            style={{
              left: `${10 + i * 30 + Math.sin((animationPhase + i * 30) / 20) * 10}%`,
              top: `${15 + i * 8 + Math.cos((animationPhase + i * 20) / 25) * 5}%`,
              transform: `scale(${0.8 + Math.sin((animationPhase + i * 15) / 30) * 0.2})`
            }}
          >
            <div
              className="w-12 h-8 rounded-full"
              style={{
                background: isSunrise
                  ? 'rgba(255, 255, 255, 0.6)'
                  : 'rgba(100, 120, 150, 0.4)',
                filter: 'blur(1px)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Reflection/Water effect at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 opacity-30"
        style={{
          background: `linear-gradient(to bottom,
            transparent 0%,
            ${isSunrise ? 'rgba(255, 200, 100, 0.2)' : 'rgba(100, 120, 180, 0.2)'} 50%,
            ${isSunrise ? 'rgba(255, 150, 50, 0.3)' : 'rgba(80, 100, 160, 0.3)'} 100%)`
        }}
      />

      {/* Floating particles/stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isSunrise ? 5 : 12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              background: isSunrise ? 'rgba(255, 220, 150, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.6 + Math.sin((animationPhase + i * 10) / 15) * 0.4
            }}
          />
        ))}
      </div>

      {/* Overlay for theme transition */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: theme === 'dark'
            ? 'rgba(0, 0, 0, 0.1)'
            : 'rgba(255, 255, 255, 0.05)'
        }}
      />
    </div>
  )
}