import { Box, Circle, HStack, Stack, Text } from "@chakra-ui/react"
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
  const borderColor = "var(--chakra-colors-tokenxyz-rosybrown-500)"

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
        top: 12,
        left: "1.375rem",
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
        top={12}
        left="1.375rem"
        width={1}
        bgColor="tokenxyz.blue.500"
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
          position="relative"
          size={12}
          bgColor={icon ? borderColor : "transparent"}
          animate={{
            background: active
              ? "var(--chakra-colors-tokenxyz-blue-500)"
              : borderColor,
          }}
          transition={{
            type: "just",
            delay: active ? 0.3 : 0,
          }}
          color="tokenxyz.white"
          boxShadow="0 4px 0 var(--chakra-colors-tokenxyz-black)"
        >
          <Circle
            position="absolute"
            inset={1}
            borderWidth={3}
            borderColor="tokenxyz.rosybrown.100"
          />
          {icon}
        </MotionCircle>
        <Text
          as="span"
          fontWeight="bold"
          fontSize="2xl"
          fontFamily="display"
          color="tokenxyz.blue.500"
          textShadow="0 1px 0 var(--chakra-colors-tokenxyz-black)"
          letterSpacing="wider"
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
