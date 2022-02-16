import { HStack, Text, useDisclosure } from "@chakra-ui/react"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import { useAccount, useConnect, useNetwork } from "wagmi"
import AccountButton from "./components/AccountButton"
import AccountModal from "./components/AccountModal"
import Identicon from "./components/Identicon"

const Account = (): JSX.Element => {
  const [{ loading }] = useConnect()
  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  })
  const { openWalletSelectorModal, triedEager, openNetworkModal } =
    useContext(Web3Connection)
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()

  if (loading) {
    return <AccountButton isLoading>Connect to a wallet</AccountButton>
  }

  if (networkData?.chain?.unsupported) {
    return (
      <AccountButton
        leftIcon={<LinkBreak />}
        colorScheme="red"
        onClick={openNetworkModal}
      >
        Wrong Network
      </AccountButton>
    )
  }

  if (!accountData?.address) {
    return (
      <AccountButton
        leftIcon={<SignIn />}
        isLoading={!triedEager}
        onClick={openWalletSelectorModal}
      >
        Connect to a wallet
      </AccountButton>
    )
  }

  return (
    <>
      <AccountButton onClick={onAccountModalOpen}>
        <HStack spacing={3}>
          <Text as="span" fontSize="md" fontWeight="semibold">
            {accountData?.ens?.name || `${shortenHex(accountData?.address, 3)}`}
          </Text>
          <Identicon address={accountData?.address} size={28} />
        </HStack>
      </AccountButton>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </>
  )
}

export default Account
