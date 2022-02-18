import { useState } from "react"

const useTimeline = (initialItem = 0) => {
  const [activeItem, setActiveItem] = useState(initialItem)

  const next = () => setActiveItem((prevValue) => prevValue + 1)

  const prev = () => setActiveItem((prevValue) => prevValue - 1)

  const reset = () => setActiveItem(initialItem)

  const setActive = (item: number) => setActiveItem(item)

  return { next, prev, reset, setActive, activeItem }
}

export default useTimeline
