import { Box, Icon, Stack, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"

type Props = {
  text: string
  link?: string
  onClick?: () => void
  disabled?: boolean
}

const AddCard = ({ text, link, onClick, disabled }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const Component = link ? Link : Box

  return (
    <Component
      as={onClick ? "button" : undefined}
      _hover={
        disabled
          ? undefined
          : {
              textDecor: "none",
              bg: colorMode === "light" ? "gray.100" : "whiteAlpha.50",
            }
      }
      borderRadius="2xl"
      display="flex"
      w="full"
      px={{ base: 5, sm: 7 }}
      py={link ? 9 : 7}
      borderWidth={2}
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      href={link}
      cursor="pointer"
      onClick={onClick}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
    >
      <Stack direction="row" spacing={5} alignItems="center">
        <Icon
          as={Plus}
          boxSize={8}
          color={colorMode === "light" ? "gray.300" : "gray.500"}
        />
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? "gray.400" : "gray.500"}
        >
          {text}
        </Text>
      </Stack>
    </Component>
  )
}

export default AddCard
