import { ethers } from "ethers"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { useContract, useSigner } from "wagmi"

const useTokenXyzContract = (): ethers.Contract => {
  const [{ data: signerData }] = useSigner()

  return useContract({
    addressOrName: process.env.NEXT_PUBLIC_TOKENXYZ_CONTRACT_ADDRESS,
    contractInterface: TokenXyzABI,
    signerOrProvider: signerData,
  })
}

export default useTokenXyzContract
