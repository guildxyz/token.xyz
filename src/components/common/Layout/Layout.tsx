import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  useColorMode,
} from "@chakra-ui/react"
import Meta from "components/common/Meta"
import { PropsWithChildren, ReactNode } from "react"
import Account from "./components/Account"
import InfoMenu from "./components/InfoMenu"

type Props = {
  title?: string
  description?: string
  action?: ReactNode | undefined
}

const Layout = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <>
      {title && <Meta title={title} description={description} />}
      <Box
        bgColor={
          colorMode === "light" ? "gray.100" : "var(--chakra-colors-gray-800)"
        }
        minHeight="100vh"
      >
        <Flex w="full" justifyContent="space-between" alignItems="center" p="2">
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            display="flex"
            alignItems="center"
            h="var(--chakra-space-11)"
          >
            Token.xyz
          </Heading>
          <HStack spacing="2">
            <Account />
            <InfoMenu />
          </HStack>
        </Flex>
        <Container
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
