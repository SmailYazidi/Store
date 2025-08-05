"use client"

import { useEffect, useRef, useState } from "react"

const AnimatedText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current

    if (container && textEl) {
      const isOver = textEl.scrollWidth > container.clientWidth
      setIsOverflowing(isOver)
    }
  }, [text])

  return (
    <div className="relative h-5 overflow-hidden" ref={containerRef}>
      <div
        ref={textRef}
        className={`absolute whitespace-nowrap will-change-transform ${
          isOverflowing ? "animate-scroll" : ""
        }`}
      >
        {text}
      </div>
    </div>
  )
}

export default AnimatedText
