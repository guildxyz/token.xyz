import useTokenDeployedEvents from "./useTokenDeployedEvents"

const useAllTokens = (): {
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
  } = useTokenDeployedEvents("ALL")

  const data: Array<string> =
    tokenDeployedEvents?.map((event) => event.args?.[2]?.toLowerCase()) ?? []

  return {
    ...swrResponse,
    data,
  }
}

export default useAllTokens
