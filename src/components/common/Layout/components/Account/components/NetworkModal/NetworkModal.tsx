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
import { chains } from "connectors"
import useToast from "hooks/useToast"
import { useNetwork } from "wagmi"
import NetworkButton from "./components/NetworkButton"

const NetworkModal = ({ isOpen, onClose }) => {
  const [{ error }, switchNetwork] = useNetwork()
  const toast = useToast()

  const requestManualNetworkChange = (chainName: string) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chainName} from your wallet manually!`,
      status: "error",
      duration: 4000,
    })

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
                    ? () => switchNetwork(chain.id)
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
