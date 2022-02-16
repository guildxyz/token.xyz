import useSWRImmtable from "swr/immutable"
import { useAccount, useSignMessage } from "wagmi"
import useToast from "./useToast"

const usePersonalSign = (shouldShowErrorToast = false) => {
  const [{ data: accountData }] = useAccount()
  const [, signMessage] = useSignMessage()
  const toast = useToast()

  const { data, mutate, isValidating, error } = useSWRImmtable(
    ["sign", accountData],
    () =>
      signMessage({ message: "Please sign this message to verify your address" }),
    {
      revalidateOnMount: false,
      shouldRetryOnError: false,
    }
  )

  const removeError = () => mutate((_) => _, false)

  const callbackWithSign = (callback: () => void) => async () => {
    removeError()
    if (!data) {
      const newData = await mutate()
      if (newData) callback()
      else if (shouldShowErrorToast)
        toast({
          title: "Request rejected",
          description: "Please try again and confirm the request in your wallet",
          status: "error",
          duration: 4000,
        })
    } else {
      callback()
    }
  }

  return {
    addressSignedMessage: data,
    callbackWithSign,
    isSigning: isValidating,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !data && !isValidating ? error : undefined,
    removeError,
  }
}

export default usePersonalSign
