import { useDisclosure } from "@chakra-ui/react"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { createContext, PropsWithChildren, useContext } from "react"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useEagerConnect from "./hooks/useEagerConnect"

const Web3Connection = createContext({
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  triedEager: false,
  isNetworkModalOpen: false,
  openNetworkModal: () => {},
  closeNetworkModal: () => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  return (
    <Web3Connection.Provider
      value={{
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
        isNetworkModalOpen,
        openNetworkModal,
        closeNetworkModal,
      }}
    >
      {children}
      <WalletSelectorModal
        {...{
          isModalOpen: isWalletSelectorModalOpen,
          openModal: openWalletSelectorModal,
          closeModal: closeWalletSelectorModal,
          openNetworkModal,
        }}
      />
      <NetworkModal
        {...{ isOpen: isNetworkModalOpen, onClose: closeNetworkModal }}
      />
    </Web3Connection.Provider>
  )
}

const useWeb3ConnectionManager = () => useContext(Web3Connection)

export { useWeb3ConnectionManager, Web3ConnectionManager }
