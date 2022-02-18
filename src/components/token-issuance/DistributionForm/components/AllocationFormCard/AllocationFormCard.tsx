import {
  Button,
  FormControl,
  FormErrorMessage,
  GridItem,
  Input,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import FormCard from "../FormCard"
import VestingTypePicker from "./components/VestingTypePicker"

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

        <GridItem colSpan={2}>
          <VestingTypePicker index={index} />
        </GridItem>

        <GridItem colSpan={2}>
          <Tag>
            Estimated gas cost:
            <Text as="b" ml={1}>
              0.44 ETH
            </Text>
          </Tag>
        </GridItem>
      </SimpleGrid>
    </FormCard>
  )
}

export default AllocationFormCard
