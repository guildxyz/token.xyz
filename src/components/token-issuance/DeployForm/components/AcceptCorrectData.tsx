import { Checkbox, Heading, Stack, Text } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

const AcceptCorrectData = () => {
  const { control, register } = useFormContext<TokenIssuanceFormType>()
  const correct = useWatch({ control, name: "correct" })

  return (
    <Stack>
      <Heading as="h3" mb={2} color="tokenxyz.blue.500" fontSize="xl">
        Confirm data
      </Heading>
      <Checkbox
        justifyContent="space-between"
        px={4}
        py={2}
        bgColor="tokenxyz.white"
        borderWidth={1}
        borderColor="tokenxyz.rosybrown.500"
        borderRadius="xl"
        colorScheme="tokenxyz.rosybrown"
        {...register("correct")}
      >
        <Text
          as="span"
          color={correct ? "tokenxyz.rosybrown.500" : "tokenxyz.red.500"}
        >
          These values are correct
        </Text>
      </Checkbox>
    </Stack>
  )
}

export default AcceptCorrectData
