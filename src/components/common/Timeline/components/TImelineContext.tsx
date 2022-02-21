import { createContext, PropsWithChildren, useContext, useState } from "react"
import { TimelineSteps } from "types"

const TimelineContext = createContext<{
  steps: TimelineSteps
  next: () => void
  prev: () => void
  reset: () => void
  setActive: (index: number) => void
  activeItem: number
}>({
  steps: [],
  next: () => {},
  prev: () => {},
  reset: () => {},
  setActive: () => {},
  activeItem: 0,
})

type Props = {
  steps: TimelineSteps
  initialItem?: number
}

const TimelineProvider = ({
  steps,
  initialItem = 0,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const [activeItem, setActiveItem] = useState(initialItem)
  const next = () => {
    if (activeItem === steps.length - 1) return
    setActiveItem((prevValue) => prevValue + 1)
  }
  const prev = () => {
    if (activeItem === 0) return
    setActiveItem((prevValue) => prevValue - 1)
  }
  const reset = () => setActiveItem(initialItem)
  const setActive = (item: number) => setActiveItem(item)

  return (
    <TimelineContext.Provider
      value={{ steps, next, prev, reset, setActive, activeItem }}
    >
      {children}
    </TimelineContext.Provider>
  )
}

const useTimeline = () => useContext(TimelineContext)

export { TimelineProvider, useTimeline }
