import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import CopyableAddress from "components/common/CopyableAddress"
import Modal from "components/common/Modal"
import { useContext } from "react"
import { useAccount } from "wagmi"
import { Web3Connection } from "../../../../../../_app/Web3ConnectionManager"
import Identicon from "../Identicon"

const AccountModal = ({ isOpen, onClose }) => {
  const [{ data: accountData }] = useAccount()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const handleWalletProviderSwitch = () => {
    openWalletSelectorModal()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction="row" spacing="4" alignItems="center">
            <Identicon address={accountData?.address} size={40} />
            <CopyableAddress
              address={accountData?.address}
              decimals={5}
              fontSize="2xl"
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
              Connected with {accountData?.connector?.name}
            </Text>
            <Button size="sm" variant="outline" onClick={handleWalletProviderSwitch}>
              Switch
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
