import useSWR, { SWRResponse } from "swr"
import { AllocationJSON } from "types"

const fetchData = (endpoint: string) => fetch(endpoint).then((res) => res.json())

const useAllocationData = (fileName: string): SWRResponse<AllocationJSON> =>
  useSWR(
    fileName ? `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${fileName}` : null,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )
export default useAllocationData
