import {
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react"
import { ArrowSquareOut, Code, Info, Sun } from "phosphor-react"

const InfoMenu = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Agora logo"
        isRound
        variant="ghost"
        h="10"
        icon={<Icon width="1.2em" height="1.2em" as={Info} />}
      />
      <MenuList border="none" shadow="md">
        <MenuGroup
          title={
            (
              <>
                Powered by
                <Link
                  href="https://agora.xyz/"
                  isExternal
                  ml="1"
                  fontWeight={"bold"}
                >
                  agora.xyz
                  <Icon as={ArrowSquareOut} ml="1" />
                </Link>
              </>
            ) as any
          }
          pb="2"
        >
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="https://github.com/AgoraSpaceDAO/frontend-boilerplate"
            rel="noopener"
            icon={<Code />}
          >
            Code
          </MenuItem>
          <MenuItem
            py="2"
            icon={<Sun />}
            closeOnSelect={false}
            onClick={toggleColorMode}
          >
            Theme
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export default InfoMenu
