"use client"
import React from "react"
import { GoogleGeminiEffect } from "../ui/hero-bg-effect"


export default function HeroBG() {
  const [pathLengths, setPathLengths] = React.useState([0, 0, 0, 0, 0])

  React.useEffect(() => {
    const animate = () => {
      // Forward animation (0 to 1.2)
      setPathLengths([1.2, 1.2, 1.2, 1.2, 1.2])

      // After forward completes (2s), wait 3s, then reverse
      setTimeout(() => {
        // Reverse animation (1.2 to 0)
        setPathLengths([0, 0, 0, 0, 0])

        // After reverse completes (2s), wait 3s, then start forward again
        setTimeout(() => {
          animate()
        }, 2000 + 3000) // 2s reverse animation + 3s break
      }, 2000 + 3000) // 2s forward animation + 3s break
    }

    // Start the first animation
    animate()
  }, [])

  return (
    <div className="opacity-60">
      <GoogleGeminiEffect className=" opacity-60" pathLengths={pathLengths} />
    </div>
  )
}
