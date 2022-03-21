import { StackDivider, useColorMode, useRadioGroup, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import LinearVestingForm from "./LinearVestingForm"
import NoVestingForm from "./NoVestingForm"
import VestingTypeOption from "./VestingTypeOption"

type Props = {
  index: number
}

const OPTIONS: Array<{
  value: string
  title: string
  description?: string
  disabled: boolean | string
  children?: (props: any) => JSX.Element
}> = [
  {
    value: "NO_VESTING",
    title: "No vesting",
    description:
      "Tokens will be available to your recipients for claiming right after the minting event.",
    disabled: false,
    children: NoVestingForm,
  },
  {
    value: "LINEAR_VESTING",
    title: "Linear vesting",
    description:
      "Set custom lengths of vesting and cliff periods for this distribution group.",
    disabled: false,
    children: LinearVestingForm,
  },
  {
    value: "BOND_VESTING",
    title: "Bond vesting",
    disabled: "Coming soon",
  },
]

const VestingTypePicker = ({ index }: Props): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    trigger,
    formState: { touchedFields },
  } = useFormContext<TokenIssuanceFormType>()

  const { field } = useController({
    control,
    name: `distributionData.${index}.vestingType`,
    rules: { required: "You must pick a realm for your guild" },
    defaultValue: "NO_VESTING",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: `distributionData.${index}.vestingType`,
    onChange: field.onChange,
    value: field.value,
    defaultValue: "NO_VESTING",
  })

  const group = getRootProps()
  const { colorMode } = useColorMode()

  const vestingType = getValues(`distributionData.${index}.vestingType`)
  useEffect(() => {
    if (vestingType !== "NO_VESTING") {
      if (touchedFields.distributionData?.[index]?.vestingPeriod)
        trigger(`distributionData.${index}.vestingPeriod`)
      if (touchedFields.distributionData?.[index]?.cliff)
        trigger(`distributionData.${index}.cliff`)
      return
    }

    setValue(`distributionData.${index}.vestingPeriod`, 0)
    setValue(`distributionData.${index}.cliff`, 0)
    clearErrors([
      `distributionData.${index}.vestingPeriod`,
      `distributionData.${index}.cliff`,
    ])
  }, [vestingType])

  return (
    <VStack
      {...group}
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
          <VestingTypeOption key={option.value} {...radio} {...option}>
            {option.children && <option.children index={index} />}
          </VestingTypeOption>
        )
      })}
    </VStack>
  )
}

export default VestingTypePicker
