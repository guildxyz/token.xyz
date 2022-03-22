import {
  Box,
  Circle,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { KeyboardEventHandler, PropsWithChildren } from "react"

const MotionBox = motion(Box)
const MotionCircle = motion(Circle)

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
  const borderColor = useColorModeValue(
    "var(--chakra-colors-gray-200)",
    "var(--chakra-colors-gray-700)"
  )

  const handleTitleKeyDown: KeyboardEventHandler = (event) => {
    if (event.code === "Enter") onClick()
  }

  return (
    <Stack
      spacing={0}
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
        bgColor: borderColor,
      }}
      _last={{
        _before: { display: "none" },
      }}
    >
      <MotionBox
        position="absolute"
        top={10}
        left="1.125rem"
        width={1}
        bgColor="primary.500"
        animate={{
          height: completed ? "100%" : "0%",
        }}
        transition={{
          type: "just",
          duration: 0.3,
          delay: completed ? 0 : 0.3,
        }}
      />
      <HStack>
        <MotionCircle
          size={10}
          // borderWidth={4}
          // borderColor={active ? "primary.500" : borderColor}
          bgColor={icon ? borderColor : "transparent"}
          animate={{
            background: active ? "var(--chakra-colors-primary-500)" : borderColor,
          }}
          transition={{
            type: "just",
            delay: active ? 0.3 : 0,
          }}
          color={active ? "white" : undefined}
        >
          {icon}
        </MotionCircle>
        <Text
          as="span"
          fontWeight="bold"
          fontSize="lg"
          fontFamily="display"
          // cursor={completed ? "pointer" : undefined}
          // onClick={completed ? onClick : undefined}
          // tabIndex={completed ? 0 : -1}
          // _focus={{
          //   outline: "none",
          // }}
          // _focusVisible={
          //   completed
          //     ? {
          //         textDecoration: "underline",
          //       }
          //     : undefined
          // }
          // onKeyDown={completed ? handleTitleKeyDown : undefined}
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
