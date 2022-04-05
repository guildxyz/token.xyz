import {
  Button,
  Circle,
  GridItem,
  Heading,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useConfetti } from "components/common/ConfettiContext"
import Modal from "components/common/Modal"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { iconUrls } from "connectors"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import { useNetwork } from "wagmi"
import useDeploy from "../hooks/useDeploy"

const DeployButtons = (): JSX.Element => {
  const { openNetworkModal, closeNetworkModal } = useWeb3ConnectionManager()
  const [{ data: networkData }] = useNetwork()

  const { control, setValue, handleSubmit } = useFormContext<TokenIssuanceFormType>()
  const chain = useWatch({ control, name: "chain" })
  const correct = useWatch({ control, name: "correct" })

  const { startDeploy, isLoading, loadingText, finished } = useDeploy()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const startConfetti = useConfetti()

  // Change token chain if the user changes the deployment chain
  useEffect(() => {
    if (!networkData?.chain || networkData.chain.id === chain) return
    setValue("chain", networkData.chain.id)
    toast({
      title: "Chain changed!",
      description: `Your token will be deployed on ${networkData.chain.name}`,
    })
    closeNetworkModal()
  }, [networkData])

  useEffect(() => {
    if (!finished) return
    onOpen()
  }, [finished])

  useEffect(() => {
    if (!isOpen) return
    startConfetti()
  }, [isOpen])

  return (
    <>
      <Stack>
        <SimpleGrid columns={3} gap={4}>
          <GridItem colSpan={{ base: 3, sm: 1 }}>
            <Button
              colorScheme="tokenxyz.blue"
              leftIcon={
                <Circle bgColor="tokenxyz.white" size={6}>
                  <Img
                    src={iconUrls[networkData?.chain?.id]}
                    boxSize={4}
                    alt={`${networkData?.chain?.name} logo`}
                  />
                </Circle>
              }
              w="full"
              size="lg"
              onClick={openNetworkModal}
            >
              {networkData?.chain?.name}
            </Button>
          </GridItem>

          <GridItem colSpan={{ base: 3, sm: 2 }}>
            <Button
              w="full"
              size="lg"
              colorScheme="tokenxyz.red"
              disabled={!correct || isLoading}
              isLoading={isLoading}
              loadingText={loadingText}
              // TODO error handler
              onClick={handleSubmit(startDeploy, console.log)}
            >
              {`Deploy to ${networkData?.chain?.name}`}
            </Button>
          </GridItem>
        </SimpleGrid>
      </Stack>

      <Modal {...{ isOpen, onClose }} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Congratulations! 🎉</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={8}>
              <Text>You've successfully issued your first token!</Text>
              <Stack>
                <Heading as="h3" fontFamily="display" fontSize="lg">
                  What's next?
                </Heading>
                <Text>
                  You can now go to your dashboard and... idk, you can't do anything
                  yet. Lorem ipsum dolor sit amet. Jeje.
                </Text>
              </Stack>

              <Stack>
                <Heading as="h3" fontFamily="display" fontSize="lg">
                  {`Token gate your community with $${tokenTicker}!`}
                </Heading>
                <Text>Guild.xyz promo goes brrr.</Text>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="tokenxyz.rosybrown">Go to my dashboard</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeployButtons
