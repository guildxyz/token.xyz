import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  RadioProps,
  Tag,
  Text,
  useColorMode,
  useRadio,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  value: string
  title: string
  description?: string
  disabled: boolean | string
} & RadioProps

const EconomyModelOption = ({
  children,
  ...props
}: PropsWithChildren<Props>): JSX.Element => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()
  const { title, description, disabled, isChecked } = props

  const { colorMode } = useColorMode()

  if (disabled)
    return (
      <Button
        as="fieldset"
        variant="ghost"
        w="full"
        h="auto"
        p="0"
        flexDir="column"
        alignItems="strech"
        borderRadius="none"
        _first={{ borderTopRadius: "xl" }}
        _last={{ borderBottomRadius: "xl" }}
        boxShadow="none !important"
        _active={{ bg: null }}
        disabled
      >
        <Flex as="label" py="4" px="5" alignItems="center">
          <Box whiteSpace="break-spaces" w="full">
            <Heading size="sm">
              {title}
              <Tag colorScheme="gray" size="sm" ml="3" mt="-1px">
                {disabled}
              </Tag>
            </Heading>
          </Box>
        </Flex>
      </Button>
    )

  return (
    <Button
      as="fieldset"
      variant="ghost"
      {...checkbox}
      w="full"
      h="auto"
      p="0"
      flexDir="column"
      alignItems="strech"
      borderRadius="none"
      _first={{ borderTopRadius: "xl" }}
      _last={{ borderBottomRadius: "xl" }}
      boxShadow="none !important"
      border="2px"
      bg={colorMode === "light" ? "white" : (isChecked && "gray.700") || null}
      borderColor={isChecked ? "primary.500" : "transparent"}
      _hover={{
        bg: isChecked
          ? null
          : colorMode === "light"
          ? "blackAlpha.50"
          : "whiteAlpha.50",
      }}
      _active={{ bg: null }}
    >
      <Flex as="label" py={4} px={5} cursor="pointer" alignItems="center">
        <input {...input} />
        <Box whiteSpace="break-spaces" w="full">
          <Heading size="sm">{title}</Heading>
          {description && (
            <Text fontWeight="normal" colorScheme="gray" mt={1} fontSize="sm">
              {description}
            </Text>
          )}
        </Box>
      </Flex>
      {children && <Collapse in={isChecked}>{children}</Collapse>}
    </Button>
  )
}

export default EconomyModelOption
