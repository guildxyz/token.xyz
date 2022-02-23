import confetti from "canvas-confetti"
import useWindowSize from "hooks/useWindowSize"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react"

const ConfettiContext = createContext<() => void>(null)

const ConfettiProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { width, height } = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle window resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) return
    canvas.width = width
    canvas.height = height
  }, [width, height])

  const startConfetti = () => {
    if (!canvasRef.current) return
    const myConfetti = confetti.create(canvasRef.current, { resize: true })
    myConfetti({
      particleCount: 200,
      spread: 180,
      angle: 90,
      origin: { x: 0.5, y: 1 },
      startVelocity: 80,
    })
    setTimeout(() => {
      myConfetti.reset()
    }, 5000)
  }

  return (
    <ConfettiContext.Provider value={startConfetti}>
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "full",
          height: "full",
          pointerEvents: "none",
          zIndex: 10001,
        }}
      />
    </ConfettiContext.Provider>
  )
}

const useConfetti = () => useContext(ConfettiContext)

export { useConfetti, ConfettiProvider }
