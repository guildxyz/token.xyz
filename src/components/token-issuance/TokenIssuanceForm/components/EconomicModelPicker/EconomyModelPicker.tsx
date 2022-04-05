import { useRadioGroup, VStack } from "@chakra-ui/react"
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
    description: "Choose your limited supply type.",
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
  const {
    control,
    setValue,
    clearErrors,
    trigger,
    formState: { dirtyFields },
  } = useFormContext<TokenIssuanceFormType>()

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

  const economyModel = useWatch({ control, name: "economyModel" })
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const maxSupply = useWatch({ control, name: "maxSupply" })

  useEffect(() => clearErrors(["initialSupply", "maxSupply"]), [economyModel])

  useEffect(() => {
    if (dirtyFields.initialSupply) trigger("initialSupply")
    if (dirtyFields.maxSupply && economyModel !== "UNLIMITED") trigger("maxSupply")
  }, [economyModel, initialSupply, maxSupply])

  return (
    <VStack
      {...group}
      w="full"
      bg="tokenxyz.rosybrown.50"
      spacing="0"
      borderRadius="xl"
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
