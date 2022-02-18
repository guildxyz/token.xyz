import { FormControl, FormErrorMessage, Input, SimpleGrid } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

type Props = {
  index: number
}

const LinearVestingForm = ({ index }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
      <FormControl isInvalid={errors?.distributionData?.[index]?.vestingPeriod}>
        <Input
          {...register(`distributionData.${index}.vestingPeriod`, {
            required: "This field is required!",
            shouldUnregister: true,
          })}
          placeholder="Vesting period"
        />
        <FormErrorMessage>
          {errors?.distributionData?.[index]?.vestingPeriod?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors?.distributionData?.[index]?.cliff}>
        <Input
          {...register(`distributionData.${index}.cliff`, {
            required: "This field is required!",
            shouldUnregister: true,
          })}
          placeholder="Cliff"
        />
        <FormErrorMessage>
          {errors?.distributionData?.[index]?.cliff?.message}
        </FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  )
}

export default LinearVestingForm
