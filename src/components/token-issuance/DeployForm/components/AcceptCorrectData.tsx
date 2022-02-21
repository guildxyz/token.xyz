import { Checkbox, Heading, Stack, Text } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

const AcceptCorrectData = () => {
  const { control, register } = useFormContext()
  const correct = useWatch({ control, name: "correct" })

  return (
    <Stack>
      <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
        Confirm data
      </Heading>
      <Checkbox
        colorScheme="gray"
        justifyContent="space-between"
        px={4}
        py={2}
        borderWidth={1}
        borderRadius="xl"
        {...register("correct")}
      >
        <Text as="span" color={correct ? "green.400" : "red.400"}>
          These values are correct
        </Text>
      </Checkbox>
    </Stack>
  )
}

export default AcceptCorrectData
