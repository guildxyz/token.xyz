import { useEffect, useRef } from "react"

const usePrevious = <T>(value: T): T => {
  const ref: any = useRef<T>()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export default usePrevious
