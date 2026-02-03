'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from '@/constants/translations'
import './page.css'

export default function Home() {
  const [yesClicked, setYesClicked] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([])
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number }>>([])
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  const [bows, setBows] = useState<Array<{ id: number; left: number; delay: number }>>([])
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const moveNoButton = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!noButtonRef.current || !containerRef.current) return

    const container = containerRef.current
    const button = noButtonRef.current
    const buttonRect = button.getBoundingClientRect()

    // Use window dimensions for iOS Safari compatibility
    // window.innerHeight/Width accounts for address bar changes
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const buttonWidth = buttonRect.width || 200
    const buttonHeight = buttonRect.height || 60

    // Generate random position within viewport bounds with safe margins
    const margin = 20
    const maxX = Math.max(0, viewportWidth - buttonWidth - margin)
    const maxY = Math.max(0, viewportHeight - buttonHeight - margin)

    const randomX = Math.random() * maxX + margin
    const randomY = Math.random() * maxY + margin

    // Apply position using fixed positioning relative to viewport
    // Use transform for better iOS Safari performance
    button.style.position = 'fixed'
    button.style.left = `${randomX}px`
    button.style.top = `${randomY}px`
    button.style.right = 'auto'
    button.style.bottom = 'auto'
    button.style.transform = 'translateZ(0)' // Force hardware acceleration on iOS
    button.style.zIndex = '1000'
    button.style.webkitTransform = 'translateZ(0)' // iOS Safari prefix

    // Prevent default click behavior and scrolling
    if (e) {
      e.preventDefault()
      e.stopPropagation()
      // Prevent iOS Safari bounce scroll
      if (e.type === 'touchstart' || e.type === 'touchmove') {
        const touchEvent = e as React.TouchEvent
        if (touchEvent.touches && touchEvent.touches.length > 0) {
          touchEvent.preventDefault()
        }
      }
    }
  }

  const handleYesClick = () => {
    setYesClicked(true)

    // Create floating hearts
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setHearts(newHearts)

    // Create sparkles
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }))
    setSparkles(newSparkles)

    // Create confetti
    const colors = ['#ff6b9d', '#ffb3d9', '#ffc0e5', '#ffd6e8', '#ffe5f1', '#ff69b4']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(newConfetti)

    // Create floating bows
    const newBows = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setBows(newBows)
  }

  useEffect(() => {
    if (yesClicked) {
      // Remove hearts after animation
      const timer = setTimeout(() => {
        setHearts([])
        setSparkles([])
        setConfetti([])
        setBows([])
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [yesClicked])

  return (
    <div ref={containerRef} className="container">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💖
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${Math.random() * 1.5}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}

      {/* Floating Bows */}
      {bows.map((bow) => (
        <div
          key={bow.id}
          className="bow"
          style={{
            left: `${bow.left}%`,
            animationDelay: `${bow.delay}s`,
          }}
        >
          🎀
        </div>
      ))}

      <AnimatePresence mode="wait">
        {!yesClicked ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="question-container"
          >
            {/* Hello Kitty Image */}
            <motion.div
              className="hello-kitty-image"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={translations.imageUrls.helloKitty}
                alt={translations.images.helloKitty}
                className="kitty-gif"
              />
            </motion.div>
            
            <h1 className="question">{translations.question}</h1>
            <div className="buttons-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                className="button button-yes"
              >
                {translations.buttons.yes}
              </motion.button>
              <motion.button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onMouseMove={(e) => {
                  // Only move if mouse is very close to button
                  const rect = e.currentTarget.getBoundingClientRect()
                  const distance = Math.sqrt(
                    Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
                    Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
                  )
                  if (distance < 100) {
                    moveNoButton(e)
                  }
                }}
                onTouchStart={(e) => {
                  moveNoButton(e)
                }}
                onTouchMove={(e) => {
                  // Move button as finger approaches on iOS
                  const touch = e.touches[0]
                  if (touch) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const distance = Math.sqrt(
                      Math.pow(touch.clientX - (rect.left + rect.width / 2), 2) +
                      Math.pow(touch.clientY - (rect.top + rect.height / 2), 2)
                    )
                    if (distance < 80) {
                      moveNoButton(e)
                    }
                  }
                }}
                onClick={(e) => {
                  moveNoButton(e)
                  e.preventDefault()
                }}
                className="button button-no"
                style={{ position: 'relative' }}
              >
                {translations.buttons.no}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="answer-container"
          >
            {/* Happy Hello Kitty */}
            <motion.div
              className="hello-kitty-happy"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              <img
                src={translations.imageUrls.helloKittyHappy}
                alt={translations.images.helloKittyHappy}
                className="kitty-gif-happy"
              />
            </motion.div>
            
            <motion.h1
              className="answer pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              {translations.success.mainMessage}
            </motion.h1>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {translations.success.subtitle}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
