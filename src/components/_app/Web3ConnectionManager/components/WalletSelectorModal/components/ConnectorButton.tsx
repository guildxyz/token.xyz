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
    variant="outline"
    colorScheme="tokenxyz.rosybrown"
    display="flex"
    justifyContent="space-between"
    px="1rem!important"
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
