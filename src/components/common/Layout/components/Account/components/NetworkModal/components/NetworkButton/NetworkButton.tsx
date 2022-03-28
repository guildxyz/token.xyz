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
          variant="unstyled"
          display="flex"
          alignContent="space-between"
          px="1rem!important"
          bgColor="tokenxyz.rosybrown.200"
          _hover={{ bg: "tokenxyz.rosybrown.100" }}
          _active={{ bg: null }}
          _focus={{ bg: "tokenxyz.rosybrown.100" }}
          border={isCurrentChain && "2px"}
          borderColor="tokenxyz.rosybrown.500"
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
