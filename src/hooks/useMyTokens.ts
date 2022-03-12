import useTokenDeployedEvents from "./useTokenDeployedEvents"

const useMyTokens = (): {
  data: Array<string>
  error?: any
  isValidating: boolean
} => {
  const {
    data: tokenDeployedEvents,
    // We won't return the `mutate` function from this hook, so we're "exlcluding" it here from `swrResponse`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutate,
    ...swrResponse
  } = useTokenDeployedEvents()

  const data: Array<string> =
    tokenDeployedEvents?.map((event) => event.args?.[2]?.toLowerCase()) ?? []

  return {
    ...swrResponse,
    data,
  }
}

export default useMyTokens
