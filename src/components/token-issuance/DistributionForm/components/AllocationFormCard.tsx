import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  SimpleGrid,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import FormCard from "./FormCard"

type Props = {
  index: number
  field: Record<string, any> // TODO: better types
  onRemove?: () => void
}

const AllocationFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormCard title="Allocation" onRemove={onRemove}>
      <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <FormControl isInvalid={errors?.allocationName} w="full">
          <Input
            {...register(`distributionData.${index}.allocationName`, {
              required: "This field is required!",
            })}
            placeholder="Name"
          />
          <FormErrorMessage>{errors?.allocationName?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="primary" h={10}>
          Upload .csv
        </Button>
      </SimpleGrid>
    </FormCard>
  )
}

export default AllocationFormCard
