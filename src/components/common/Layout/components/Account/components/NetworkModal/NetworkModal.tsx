import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import processConnectionError from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/utils/processConnectionError"
import { chains as allSupportedChains, ChainSlugs } from "connectors"
import usePrevious from "hooks/usePrevious"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { useNetwork } from "wagmi"
import NetworkButton from "./components/NetworkButton"

const NetworkModal = ({ isOpen, onClose }) => {
  const router = useRouter()

  const [{ data, error }, switchNetwork] = useNetwork()

  // If there's a `chain` parameter in the URL (e.g. on a token page), then display only that chain in the supported chains list, so the user can only switch to the correct network
  const chains = useMemo(
    () =>
      router.query?.chain
        ? allSupportedChains?.filter(
            (chain) => chain.id === ChainSlugs[router.query.chain.toString()]
          )
        : allSupportedChains,
    [allSupportedChains, router.query]
  )

  const toast = useToast()
  const requestManualNetworkChange = (chainName: string) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chainName} from your wallet manually!`,
      status: "error",
      duration: 4000,
    })

  const previousChain = usePrevious(data?.chain?.id)

  useEffect(() => {
    if (previousChain && data?.chain?.id === previousChain) return
    onClose()
  }, [data, previousChain])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {switchNetwork ? "Supported networks" : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={error} processError={processConnectionError} />
          <Stack spacing={3}>
            {chains.map((chain) => (
              <NetworkButton
                key={chain.id}
                chain={chain}
                requestNetworkChange={
                  switchNetwork
                    ? () => switchNetwork(chain.id).then(() => onClose())
                    : requestManualNetworkChange(chain.name)
                }
              />
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
