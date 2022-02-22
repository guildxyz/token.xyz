import { Button, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { useConfetti } from "components/common/ConfettiContext"
import { useFormContext, useWatch } from "react-hook-form"

const DeployButtons = (): JSX.Element => {
  const { control } = useFormContext()
  const correct = useWatch({ control, name: "correct" })
  const startConfetti = useConfetti()

  return (
    <Stack>
      <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
        Deploy
      </Heading>
      <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Button size="lg" variant="outline" disabled={!correct}>
          Deploy to testnet
        </Button>
        <Button
          size="lg"
          colorScheme="primary"
          disabled={!correct}
          onClick={startConfetti}
        >
          Deploy to mainnet
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default DeployButtons
