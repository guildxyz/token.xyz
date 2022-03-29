import { Button } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button
    flexGrow={1}
    // variant="unstyled"
    variant="outline"
    // borderWidth={0}
    // bgColor="tokenxyz.rosybrown.100"
    // _hover={{
    //   bgColor: "tokenxyz.rosybrown.200",
    // }}
    // _focus={{
    //   bgColor: "tokenxyz.rosybrown.200",
    // }}
    // _active={{
    //   bgColor: "tokenxyz.rosybrown.300",
    // }}
    colorScheme="tokenxyz.rosybrown"
    px="1rem!important"
    w="auto"
    {...rest}
  >
    {children}
  </Button>
)

export default AccountButton
