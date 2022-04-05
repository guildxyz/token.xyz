import unique from "utils/unique"
import useTokenDeployedEvents from "./useTokenDeployedEvents"

const useMyUrlNames = (): {
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
    tokenDeployedEvents?.map((event) => event.args?.[1])?.filter(unique) ?? []

  return {
    ...swrResponse,
    data,
  }
}

export default useMyUrlNames
