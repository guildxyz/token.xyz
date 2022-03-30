import { useRadioGroup, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import Disperse from "./Disperse"
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
    value: "DISTRIBUTE",
    title: "Distribute tokens to addresses",
    description: "Tokens will be available in the recipients addresses immediately.",
    disabled: false,
    children: Disperse,
  },
  {
    value: "NO_VESTING",
    title: "No vesting (airdrop)",
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
  // {
  //   value: "BOND_VESTING",
  //   title: "Bond vesting",
  //   disabled: "Coming soon",
  // },
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
    defaultValue: "DISTRIBUTE",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: `distributionData.${index}.vestingType`,
    onChange: field.onChange,
    value: field.value,
    defaultValue: "DISTRIBUTE",
  })

  const group = getRootProps()

  const vestingType = getValues(`distributionData.${index}.vestingType`)
  useEffect(() => {
    if (vestingType === "LINEAR_VESTING") {
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
      w="full"
      bg="tokenxyz.rosybrown.50"
      spacing="0"
      borderRadius="xl"
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
