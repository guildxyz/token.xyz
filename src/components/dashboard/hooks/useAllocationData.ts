import useSWR from "swr"

const fetchData = (hash: string, name: string) =>
  fetch(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${hash}/${name}`).then((res) =>
    res.json()
  )

const useAllocationData = (ipfsHash: string, fileName: string) =>
  useSWR(ipfsHash && fileName ? [ipfsHash, fileName] : null, fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })
export default useAllocationData
