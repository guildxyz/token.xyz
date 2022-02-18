import {
  Box,
  Circle,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { KeyboardEventHandler, PropsWithChildren } from "react"

type Props = {
  active?: boolean
  completed?: boolean
  icon?: JSX.Element
  title: string
  onClick?: () => void
}

const TimelineItem = ({
  active,
  completed,
  icon,
  title,
  onClick,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const handleTitleKeyDown: KeyboardEventHandler = (event) => {
    if (event.code === "Enter") onClick()
  }

  return (
    <Stack
      position="relative"
      overflow="hidden"
      minH={12}
      _before={{
        content: "''",
        position: "absolute",
        top: 10,
        left: "1.125rem",
        width: 1,
        height: "full",
        bgColor: completed ? "primary.500" : borderColor,
      }}
      _last={{
        _before: { display: "none" },
      }}
    >
      <HStack>
        <Circle
          size={10}
          borderWidth={4}
          borderColor={active ? "primary.500" : borderColor}
          bgColor={icon ? (active ? "primary.500" : borderColor) : "transparent"}
        >
          {icon}
        </Circle>
        <Text
          as="span"
          fontWeight="bold"
          fontSize="lg"
          fontFamily="display"
          cursor="pointer"
          onClick={onClick}
          tabIndex={0}
          _focus={{
            outline: "none",
          }}
          _focusVisible={{
            textDecoration: "underline",
          }}
          onKeyDown={handleTitleKeyDown}
        >
          {title}
        </Text>
      </HStack>

      <Box pl={12} pb={6}>
        {children}
      </Box>
    </Stack>
  )
}

export default TimelineItem
