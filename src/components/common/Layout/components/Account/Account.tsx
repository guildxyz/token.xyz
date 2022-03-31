import {
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { LinkBreak, SignIn } from "phosphor-react"
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
    useWeb3ConnectionManager()
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()

  const buttonLabel = useBreakpointValue({
    base: "Connect",
    md: "Connect to a wallet",
  })

  if (loading) {
    return <AccountButton isLoading>{buttonLabel}</AccountButton>
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
        leftIcon={<Icon position="relative" top={0.5} as={SignIn} />}
        isLoading={!triedEager}
        onClick={openWalletSelectorModal}
      >
        {buttonLabel}
      </AccountButton>
    )
  }

  return (
    <>
      <AccountButton onClick={onAccountModalOpen}>
        <HStack spacing={3}>
          <Text
            as="span"
            fontSize="md"
            fontWeight="extrabold"
            color="tokenxyz.blue.500"
          >
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
