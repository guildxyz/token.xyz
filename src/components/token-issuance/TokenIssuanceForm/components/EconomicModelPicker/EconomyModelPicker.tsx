import { StackDivider, useColorMode, useRadioGroup, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import EconomyModelOption from "./components/EconomyModelOption"
import FixedSupplyForm from "./components/FixedSupplyForm"
import UnlimitedSupplyForm from "./components/UnlimitedSupplyForm"

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
    description:
      "Choose your limited supply type.\nInitial supply = Max supply: no more tokens will be minted after this amount.\nInitial supply < Max supply: more tokens can be minted until the amount reaches the Max supply.",
    disabled: false,
    children: <FixedSupplyForm />,
  },
  {
    value: "UNLIMITED",
    title: "Unlimited",
    disabled: false,
    description:
      "Choose the amount of tokens to mint now, while an infinite amount can be released later.",
    children: <UnlimitedSupplyForm />,
  },
]

const EconomyModelPicker = (): JSX.Element => {
  const { control, setValue, clearErrors, trigger } =
    useFormContext<TokenIssuanceFormType>()

  const { field } = useController({
    control,
    name: "economyModel",
    rules: { required: "You must pick an economy model" },
    defaultValue: "FIXED",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "economyModel",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "FIXED",
  })

  const group = getRootProps()
  const { colorMode } = useColorMode()

  const economyModel = useWatch({ control, name: "economyModel" })

  useEffect(() => {
    if (economyModel !== "UNLIMITED") {
      trigger(["initialSupply", "maxSupply"])
      return
    }

    setValue("initialSupply", 0)
    setValue("maxSupply", 0)
    clearErrors(["initialSupply", "maxSupply"])
  }, [economyModel])

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
          <EconomyModelOption key={option.value} {...radio} {...option}>
            {option.children}
          </EconomyModelOption>
        )
      })}
    </VStack>
  )
}

export default EconomyModelPicker