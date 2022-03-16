import {
  Button,
  GridItem,
  Heading,
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
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import useDeploy from "../hooks/useDeploy"

const DeployButtons = (): JSX.Element => {
  const { control, handleSubmit } = useFormContext<TokenIssuanceFormType>()
  const correct = useWatch({ control, name: "correct" })

  const { startDeploy, isLoading, loadingText, finished } = useDeploy()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const startConfetti = useConfetti()

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
        <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
          Deploy
        </Heading>
        <SimpleGrid columns={2} gap={4}>
          <GridItem colSpan={{ base: 2, lg: 1 }}>
            <Button
              w="full"
              size="lg"
              variant="outline"
              disabled={!correct || isLoading}
            >
              Deploy to testnet
            </Button>
          </GridItem>

          <GridItem colSpan={{ base: 2, md: 1 }}>
            <Button
              w="full"
              size="lg"
              colorScheme="primary"
              disabled={!correct || isLoading}
              isLoading={isLoading}
              loadingText={loadingText}
              // TODO error handler
              onClick={handleSubmit(startDeploy, console.log)}
            >
              Deploy to mainnet
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
            <Button colorScheme="primary">Go to my dashboard</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeployButtons
