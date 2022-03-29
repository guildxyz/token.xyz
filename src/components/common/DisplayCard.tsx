import { HStack, Img, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  image?: string
  title: string
} & Rest

const DisplayCard = ({
  image,
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Card
    role="group"
    position="relative"
    px={{ base: 5, sm: 6 }}
    py={7}
    w="full"
    h="full"
    bg="white"
    justifyContent="center"
    _before={{
      content: `""`,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      bg: "gray.300",
      opacity: 0,
      transition: "opacity 0.2s",
    }}
    _hover={{
      _before: {
        opacity: 0.1,
      },
    }}
    _active={{
      _before: {
        opacity: 0.17,
      },
    }}
    {...rest}
  >
    <VStack spacing={1} alignItems="start" w="full" maxW="full" mt={-1}>
      <HStack spacing={2}>
        {image && (
          <Img
            src={image}
            position="relative"
            top={-0.5}
            boxSize={6}
            rounded="full"
          />
        )}
        <Text
          as="span"
          fontFamily="display"
          fontSize="2xl"
          fontWeight="bold"
          color="tokenxyz.blue.500"
          textShadow="0 1px 0 var(--chakra-colors-tokenxyz-black)"
          letterSpacing="wider"
          maxW="full"
          isTruncated
        >
          {title}
        </Text>
      </HStack>
      {children}
    </VStack>
  </Card>
)

export default DisplayCard
