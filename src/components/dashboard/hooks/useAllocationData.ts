import useSWR, { SWRResponse } from "swr"
import { AllocationJSON } from "types"

const fetchData = (fileName: string) =>
  fetch(`${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${fileName}`).then((res) =>
    res.json()
  )

const useAllocationData = (fileName: string): SWRResponse<AllocationJSON> =>
  useSWR(fileName ? [fileName] : null, fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })
export default useAllocationData
