'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from '@/constants/translations'
import './page.css'

export default function Home() {
  const [yesClicked, setYesClicked] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number }>>([])
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  const [noButtonMoved, setNoButtonMoved] = useState(false)
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

    // Find the Yes button to avoid overlapping
    const yesButton = document.querySelector('.button-yes') as HTMLElement
    let yesButtonRect: DOMRect | null = null
    if (yesButton) {
      yesButtonRect = yesButton.getBoundingClientRect()
    }

    // Generate random position within viewport bounds with safe margins
    const margin = 20
    const maxX = Math.max(0, viewportWidth - buttonWidth - margin)
    const maxY = Math.max(0, viewportHeight - buttonHeight - margin)

    let randomX: number
    let randomY: number
    let attempts = 0
    const maxAttempts = 50

    // Try to find a position that doesn't overlap with Yes button
    do {
      randomX = Math.random() * maxX + margin
      randomY = Math.random() * maxY + margin
      attempts++

      // Check if position overlaps with Yes button
      if (yesButtonRect) {
        const noButtonLeft = randomX
        const noButtonRight = randomX + buttonWidth
        const noButtonTop = randomY
        const noButtonBottom = randomY + buttonHeight

        const yesButtonLeft = yesButtonRect.left
        const yesButtonRight = yesButtonRect.right
        const yesButtonTop = yesButtonRect.top
        const yesButtonBottom = yesButtonRect.bottom

        // Check for overlap with additional padding to ensure separation
        const padding = 30
        const overlaps = !(
          noButtonRight + padding < yesButtonLeft ||
          noButtonLeft - padding > yesButtonRight ||
          noButtonBottom + padding < yesButtonTop ||
          noButtonTop - padding > yesButtonBottom
        )

        if (!overlaps || attempts >= maxAttempts) {
          break
        }
      } else {
        break
      }
    } while (attempts < maxAttempts)

    // Mark button as moved for smooth transition
    if (!noButtonMoved) {
      setNoButtonMoved(true)
      // Get current position before changing to fixed
      const currentRect = button.getBoundingClientRect()
      // Set transition first for smooth movement
      button.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      button.style.willChange = 'left, top'
      // Switch to fixed positioning at current location
      button.style.position = 'fixed'
      button.style.left = `${currentRect.left}px`
      button.style.top = `${currentRect.top}px`
      button.style.right = 'auto'
      button.style.bottom = 'auto'
      button.style.zIndex = '1000'
      // Force reflow to apply initial position before moving
      requestAnimationFrame(() => {
        button.offsetHeight
      })
    }

    // Apply new position with smooth transition
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      if (noButtonRef.current) {
        noButtonRef.current.style.left = `${randomX}px`
        noButtonRef.current.style.top = `${randomY}px`
        noButtonRef.current.style.transform = 'translateZ(0)' // Force hardware acceleration on iOS
        noButtonRef.current.style.webkitTransform = 'translateZ(0)' // iOS Safari prefix
      }
    })

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

    // Create sparkles - positioned randomly but visible
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }))
    setSparkles(newSparkles)

    // Create confetti - start from top
    const colors = ['#ff6b9d', '#ffb3d9', '#ffc0e5', '#ffd6e8', '#ffe5f1', '#ff69b4']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(newConfetti)
  }

  useEffect(() => {
    if (yesClicked) {
      // Remove animations after they complete
      const timer = setTimeout(() => {
        setSparkles([])
        setConfetti([])
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [yesClicked])

  return (
    <div ref={containerRef} className="container">
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
