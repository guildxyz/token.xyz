import { Box, Button, Img, Tooltip } from "@chakra-ui/react"
import { iconUrls } from "connectors"
import { Chain, useNetwork } from "wagmi"

type Props = {
  chain: Chain
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const [{ data }] = useNetwork()

  const isCurrentChain = chain.id === data.chain.id

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${chain.name} is currently selected`}
    >
      <Box>
        <Button
          rightIcon={
            <Img src={iconUrls[chain.id]} boxSize="6" alt={`${chain.name} logo`} />
          }
          border={isCurrentChain && "2px"}
          borderColor="primary.500"
          disabled={isCurrentChain}
          onClick={requestNetworkChange}
          isFullWidth
          size="xl"
          justifyContent="space-between"
        >
          {chain.name}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
