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
    isFullWidth
    size="xl"
    justifyContent="space-between"
    border={isActive && "2px"}
    borderColor="primary.500"
  >
    {`${name} ${isActive ? " - connected" : ""}`}
  </Button>
)

export default ConnectorButton
