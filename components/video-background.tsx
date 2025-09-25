'use client'

import { useEffect, useState, useRef } from 'react'

interface VideoBackgroundProps {
  theme?: 'light' | 'dark'
  className?: string
}

export function VideoBackground({ theme = 'light', className = '' }: VideoBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoSource = theme === 'light' ? '/videos/sunrise.mp4' : '/videos/sunset.mp4'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && videoRef.current) {
      setIsTransitioning(true)
      setIsLoading(true)

      // Smooth fade transition during video change
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0.4'
      }

      const video = videoRef.current

      const handleLoadedData = () => {
        setIsLoading(false)
        if (overlayRef.current) {
          setTimeout(() => {
            overlayRef.current!.style.opacity = theme === 'dark' ? '0.15' : '0.1'
            setIsTransitioning(false)
          }, 300)
        }
      }

      const handleTimeUpdate = () => {
        // Improve loop smoothness by seeking to start slightly before end
        if (video.currentTime > video.duration - 0.5) {
          video.currentTime = 0.1
        }
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('timeupdate', handleTimeUpdate)

      console.log('Theme changed to:', theme, 'Loading video:', videoSource)
      video.load()
      video.play().catch(error => {
        console.log('Video autoplay prevented:', error)
        setIsLoading(false)
        setIsTransitioning(false)
      })

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [mounted, theme, videoSource])

  if (!mounted) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        key={theme}
      >
        <source src={videoSource} type="video/mp4" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100">
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading beautiful scenery...
          </div>
        </div>
      </video>

      {/* Enhanced multi-layered overlay for superior text readability */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-black/20 via-purple-900/10 to-black/25'
            : 'bg-gradient-to-br from-black/15 via-amber-900/5 to-black/20'
        }`}
        style={{
          opacity: isTransitioning ? 0.4 : (theme === 'dark' ? 0.15 : 0.1)
        }}
      />

      {/* Additional text-specific overlay for maximum readability */}
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-t from-black/30 via-transparent to-black/20'
          : 'bg-gradient-to-t from-black/25 via-transparent to-black/15'
      } transition-opacity duration-700`} />

      {/* Subtle vignette effect for enhanced focus */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10 transition-opacity duration-700" />
    </div>
  )
}