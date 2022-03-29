import { useCallback, useEffect, useState } from "react"

const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState("")

  const hashChangeHandler = useCallback(() => {
    setHash(window?.location?.hash || "")
  }, [])

  useEffect(() => {
    hashChangeHandler()
    window.addEventListener("hashchange", hashChangeHandler)
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler)
    }
  }, [])

  const updateHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash) window.location.hash = newHash
    },
    [hash]
  )

  return [hash, updateHash]
}

export default useHash
