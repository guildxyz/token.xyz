import { Box, Button, Img, Tooltip } from "@chakra-ui/react"
import { iconUrls } from "connectors"
import { Chain, useNetwork } from "wagmi"

type Props = {
  chain: Chain
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const [{ data }] = useNetwork()

  const isCurrentChain = chain.id === data?.chain?.id

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${chain.name} is currently selected`}
    >
      <Box>
        <Button
          variant="outline"
          colorScheme="tokenxyz.rosybrown"
          display="flex"
          justifyContent="space-between"
          px="1rem!important"
          isFullWidth
          size="xl"
          rightIcon={
            <Img src={iconUrls[chain.id]} boxSize="6" alt={`${chain.name} logo`} />
          }
          disabled={isCurrentChain}
          onClick={requestNetworkChange}
        >
          {chain.name}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
