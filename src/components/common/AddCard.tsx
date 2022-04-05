import { Box, Icon, Stack, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"

type Props = {
  text: string
  link?: string
  onClick?: () => void
  disabled?: boolean
}

const AddCard = ({ text, link, onClick, disabled }: Props): JSX.Element => {
  const Component = link ? Link : Box

  return (
    <Component
      as={onClick ? "button" : undefined}
      _hover={
        disabled
          ? undefined
          : {
              textDecor: "none",
              bgColor: "tokenxyz.rosybrown.50",
            }
      }
      _active={{
        bgColor: "tokenxyz.rosybrown.100",
      }}
      display="flex"
      w="full"
      px={{ base: 5, sm: 7 }}
      py={link ? 9 : 7}
      bgColor="tokenxyz.white"
      borderWidth={1}
      borderColor="tokenxyz.rosybrown.500"
      borderRadius="xl"
      href={link}
      cursor="pointer"
      onClick={onClick}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      transition="background 0.2s ease"
    >
      <Stack direction="row" spacing={5} alignItems="center">
        <Icon as={Plus} boxSize={8} color="tokenxyz.rosybrown.600" />
        <Text fontWeight="bold" color="tokenxyz.rosybrown.600">
          {text}
        </Text>
      </Stack>
    </Component>
  )
}

export default AddCard
