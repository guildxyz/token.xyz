import { Heading, HStack, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  titleRightElement?: JSX.Element
} & Rest

const Section = ({
  title,
  titleRightElement,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5} {...rest}>
    <HStack spacing={2} alignItems="center">
      <Heading
        as="h2"
        fontFamily="display"
        color="tokenxyz.red.500"
        textShadow="0 1.5px 0 var(--chakra-colors-tokenxyz-black)"
        letterSpacing="wider"
        fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
      >
        {title}
      </Heading>
      {titleRightElement}
    </HStack>

    {children}
  </Stack>
)

export default Section
