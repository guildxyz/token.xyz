import { Heading, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
} & Rest

const FormSection = ({
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" alignItems="start" spacing={5} {...rest}>
    <Heading fontSize="md" as="h3">
      {title}
    </Heading>

    {children}
  </Stack>
)

export default FormSection
