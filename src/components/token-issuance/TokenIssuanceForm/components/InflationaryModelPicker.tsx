import {
  Button,
  FormControl,
  HStack,
  StackDivider,
  useColorMode,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const INFLATIONARY_MODELS: Array<{ label: string; value: string }> = [
  {
    label: "Fixed Supply",
    value: "FIXED",
  },
  {
    label: "Max Supply",
    value: "MAX",
  },
  {
    label: "Unlimited",
    value: "UNLIMITED",
  },
]

const InflationaryModelPicker = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const { control } = useFormContext()

  return (
    <FormControl>
      <HStack
        borderRadius="lg"
        bg={colorMode === "light" ? "white" : "blackAlpha.300"}
        spacing="0"
        border="1px"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        divider={<StackDivider />}
      >
        {INFLATIONARY_MODELS.map((model) => (
          <Button
            key={model.value}
            w="full"
            h={10}
            borderRadius="none"
            variant="ghost"
            _first={{ borderTopLeftRadius: "lg", borderBottomLeftRadius: "lg" }}
            _last={{ borderTopRightRadius: "lg", borderBottomRightRadius: "lg" }}
          >
            {model.label}
          </Button>
        ))}
      </HStack>
    </FormControl>
  )
}

export default InflationaryModelPicker
