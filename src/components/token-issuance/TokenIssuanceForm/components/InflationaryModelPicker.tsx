import { StackDivider, useColorMode, useRadioGroup, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import FixedSupplyForm from "./components/FixedSupplyForm"
import InflationaryModelOption from "./components/InflationaryModelOption"
import MaxSupplyForm from "./components/MaxSupplyForm"

const OPTIONS: Array<{
  value: string
  title: string
  description?: string
  disabled: boolean | string
  children?: JSX.Element
}> = [
  {
    value: "FIXED",
    title: "Fixed Supply",
    description: "Description...",
    disabled: false,
    children: <FixedSupplyForm />,
  },
  {
    value: "MAX",
    title: "Max Supply",
    description: "Description...",
    disabled: false,
    children: <MaxSupplyForm />,
  },
  {
    value: "UNLIMITED",
    title: "Unlimited",
    disabled: false,
    description: "Description...",
    children: null,
  },
]

const InflationaryModelPicker = (): JSX.Element => {
  const { control, setValue, clearErrors, trigger } = useFormContext()

  const { field } = useController({
    control,
    name: "inflationaryModel",
    rules: { required: "You must pick a realm for your guild" },
    defaultValue: "FIXED",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "inflationaryModel",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "FIXED",
  })

  const group = getRootProps()
  const { colorMode } = useColorMode()

  const inflationaryModel = useWatch({ control, name: "inflationaryModel" })

  useEffect(() => {
    if (inflationaryModel !== "UNLIMITED") {
      trigger(["initialSupply", "maxSupply"])
      return
    }

    setValue("initialSupply", 0)
    setValue("maxSupply", 0)
    clearErrors(["initialSupply", "maxSupply"])
  }, [inflationaryModel])

  return (
    <VStack
      {...group}
      w="full"
      borderRadius="xl"
      bg={colorMode === "light" ? "white" : "blackAlpha.300"}
      spacing="0"
      border="1px"
      borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
      divider={<StackDivider />}
    >
      {OPTIONS.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return (
          <InflationaryModelOption key={option.value} {...radio} {...option}>
            {option.children}
          </InflationaryModelOption>
        )
      })}
    </VStack>
  )
}

export default InflationaryModelPicker
