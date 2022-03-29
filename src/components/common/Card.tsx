import { Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

const Card = ({ children, ...rest }: PropsWithChildren<Rest>): JSX.Element => (
  <Box
    bg="tokenxyz.white"
    borderRadius="xl"
    borderWidth={1}
    borderColor="tokenxyz.rosybrown.500"
    display="flex"
    flexDirection="column"
    overflow="hidden"
    {...rest}
  >
    {children}
  </Box>
)

export default Card
