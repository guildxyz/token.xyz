import {
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import Modal from "components/common/Modal"
import { ArrowSquareOut } from "phosphor-react"
import React, { useEffect } from "react"
import { useAccount, useConnect, useNetwork } from "wagmi"
import ConnectorButton from "./components/ConnectorButton"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isModalOpen: boolean
  closeModal: () => void
  openNetworkModal: () => void
}

const WalletSelectorModal = ({
  isModalOpen,
  closeModal,
  openNetworkModal, // Passing as prop to avoid dependency cycle
}: Props): JSX.Element => {
  const [{ data: connectData, error: connectError, loading }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()
  const [{ data: networkData }] = useNetwork()

  const handleConnect = (connector) =>
    connect(connector).then(({ error }) => {
      if (error) return
      closeModal()
    })

  useEffect(() => {
    if (networkData?.chain?.unsupported) {
      closeModal()
      openNetworkModal()
    }
  }, [networkData, openNetworkModal, closeModal])

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={connectError} processError={processConnectionError} />
            <Stack spacing="4">
              {connectData.connectors.map((connector) => (
                <ConnectorButton
                  key={connector.id}
                  id={connector.id}
                  name={connector.name}
                  onClick={() => handleConnect(connector)}
                  isLoading={loading && connectData.connector === connector}
                  disabled={accountData?.connector?.id === connector?.id || loading}
                  isActive={accountData?.connector?.id === connector?.id}
                />
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Text textAlign="center">
              New to Ethereum wallets?{" "}
              <Link
                colorScheme="tokenxyz.blue"
                href="https://ethereum.org/en/wallets/"
                isExternal
              >
                Learn more
                <Icon as={ArrowSquareOut} mx="1" />
              </Link>
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletSelectorModal
