import { useState } from "react"

const useTimeline = (initialItem = 0) => {
  const [activeItem, setActiveItem] = useState(initialItem)

  const next = () => setActiveItem((prevValue) => prevValue + 1)

  const prev = () => setActiveItem((prevValue) => prevValue - 1)

  const reset = () => setActiveItem(initialItem)

  const setItem = (item: number) => setActiveItem(item)

  return { next, prev, reset, setItem, activeItem }
}

export default useTimeline
