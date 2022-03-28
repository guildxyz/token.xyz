import { HStack, Icon, Text } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"
import { Plus } from "phosphor-react"

const CreateTokenButton = (): JSX.Element => {
  const router = useRouter()

  if (router.asPath.includes("/token-issuance")) return <></>

  return (
    <LinkButton
      variant="outline"
      colorScheme="tokenxyz.rosybrown"
      href="/token-issuance"
    >
      <HStack>
        <Icon as={Plus} />
        <Text as="span" display={{ base: "none", md: "inline" }}>
          Create token
        </Text>
      </HStack>
    </LinkButton>
  )
}

export default CreateTokenButton
