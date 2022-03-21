import { TOKEN_XYZ_CONTRACT } from "connectors"
import { ethers } from "ethers"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { useContract, useNetwork, useSigner } from "wagmi"

const useTokenXyzContract = (): ethers.Contract => {
  const [{ data: networkData }] = useNetwork()
  const [{ data: signerData }] = useSigner()

  return useContract({
    addressOrName:
      TOKEN_XYZ_CONTRACT[networkData?.chain?.id] ||
      "0x0000000000000000000000000000000000000000",
    contractInterface: TokenXyzABI,
    signerOrProvider: signerData,
  })
}

export default useTokenXyzContract
