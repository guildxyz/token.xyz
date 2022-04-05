import { TOKEN_XYZ_CONTRACT } from "connectors"
import { ethers } from "ethers"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { useContract, useNetwork, useProvider, useSigner } from "wagmi"

const useTokenXyzContract = (): ethers.Contract => {
  const [{ data: networkData }] = useNetwork()
  const [{ data: signerData }] = useSigner()
  const provider = useProvider()

  return useContract({
    addressOrName:
      TOKEN_XYZ_CONTRACT[
        networkData?.chain?.id && !networkData?.chain?.unsupported
          ? networkData?.chain?.id
          : 3
      ],
    contractInterface: TokenXyzABI,
    signerOrProvider: signerData ?? provider,
  })
}

export default useTokenXyzContract
