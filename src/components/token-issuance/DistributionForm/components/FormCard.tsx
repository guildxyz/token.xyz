import { CloseButton, Heading, Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"

type Props = {
  title: string
  onRemove?: () => void
}

const FormCard = ({
  title,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Card position="relative" px={{ base: 5, sm: 6 }} py={7}>
    {typeof onRemove !== "undefined" && (
      <CloseButton
        aria-label="Remove"
        position="absolute"
        top={2}
        right={2}
        width={8}
        height={8}
        rounded="full"
        onClick={onRemove}
      />
    )}

    <Heading as="h3" fontSize="xl" fontFamily="display" mb={4}>
      {title}
    </Heading>

    <Stack>{children}</Stack>
  </Card>
)

export default FormCard
