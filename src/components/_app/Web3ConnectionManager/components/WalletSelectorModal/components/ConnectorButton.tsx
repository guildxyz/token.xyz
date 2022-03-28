import { Box, Button, Img } from "@chakra-ui/react"

type Props = {
  id: string
  name: string
  onClick: () => void
  disabled: boolean
  isActive: boolean
  isLoading: boolean
}

const ConnectorButton = ({
  id,
  name,
  onClick,
  disabled,
  isActive,
  isLoading,
}: Props): JSX.Element => (
  <Button
    variant="unstyled"
    display="flex"
    justifyContent="space-between"
    px="1rem!important"
    bgColor="tokenxyz.rosybrown.200"
    border={isActive && "2px"}
    _hover={{ bg: "tokenxyz.rosybrown.100" }}
    _active={{ bg: null }}
    _focus={{ bg: "tokenxyz.rosybrown.100" }}
    borderColor="tokenxyz.rosybrown.500"
    isFullWidth
    size="xl"
    onClick={onClick}
    rightIcon={
      <Box boxSize={6}>
        <Img
          src={`/walletLogos/${id}.svg`}
          w="full"
          h="full"
          objectFit="contain"
          alt={`${name} logo`}
        />
      </Box>
    }
    disabled={disabled}
    isLoading={isLoading}
    spinnerPlacement="end"
    loadingText={`${name} - connecting...`}
  >
    {`${name} ${isActive ? " - connected" : ""}`}
  </Button>
)

export default ConnectorButton
