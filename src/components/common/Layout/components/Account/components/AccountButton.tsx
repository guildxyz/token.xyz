import { Button } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button
    flexGrow={1}
    variant="outline"
    colorScheme="tokenxyz.rosybrown"
    px="1rem!important"
    w="auto"
    {...rest}
  >
    {children}
  </Button>
)

export default AccountButton
