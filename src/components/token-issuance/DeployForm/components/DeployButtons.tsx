import { Button, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

const DeployButtons = (): JSX.Element => {
  const { control } = useFormContext()
  const correct = useWatch({ control, name: "correct" })

  return (
    <Stack>
      <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
        Deploy
      </Heading>
      <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Button size="lg" variant="outline" disabled={!correct}>
          Deploy to testnet
        </Button>
        <Button size="lg" colorScheme="primary" disabled={!correct}>
          Deploy to mainnet
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default DeployButtons
