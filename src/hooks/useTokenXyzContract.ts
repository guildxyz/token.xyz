import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { useContract, useSigner } from "wagmi"

const useTokenXyzContract = () => {
  const [{ data: signerData }] = useSigner()

  return useContract({
    addressOrName: process.env.NEXT_PUBLIC_TOKENXYZ_CONTRACT_ADDRESS,
    contractInterface: TokenXyzABI.abi,
    signerOrProvider: signerData,
  })
}

export default useTokenXyzContract
