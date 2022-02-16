import { injected } from "connectors"
import { useEffect, useState } from "react"
import { useAccount, useConnect } from "wagmi"

const useEagerConnect = (): boolean => {
  const [, connect] = useConnect()
  const [{ data: accountData }] = useAccount()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthirozed) => isAuthirozed && connect(injected))

      .catch(() => setTried(true))
      .finally(() => setTried(true))
  }, [connect])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && accountData?.address) {
      setTried(true)
    }
  }, [tried, accountData?.address])

  return tried
}

export default useEagerConnect
