import { Heading, Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  description?: string
} & Rest

const FormSection = ({
  title,
  description,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5} {...rest}>
    <Stack spacing={2}>
      <Heading fontSize="md" as="h3">
        {title}
      </Heading>
      {description && <Text colorScheme="gray">{description}</Text>}
    </Stack>

    {children}
  </Stack>
)

export default FormSection
