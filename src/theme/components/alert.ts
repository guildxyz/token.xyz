import { getColor, mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const getBg = (props: Dict) => {
  const { theme, colorScheme: c } = props
  const lightBg = getColor(theme, `${c}.50`, c)
  const darkBg = transparentize(`${c}.200`, 0.16)(theme)
  return mode(lightBg, darkBg)(props)
}

const styles = {
  parts: ["container", "icon"],
  baseStyle: {
    container: {
      borderRadius: "xl",
    },
  },
  variants: {
    subtle: (props: Dict) => {
      const { colorScheme: c } = props
      return {
        container: {
          bg: getBg(props),
          py: 4,
          alignItems: "flex-start",
        },
        icon: {
          color: mode(`${c}.500`, `${c}.200`)(props),
          mt: "3px",
        },
      }
    },
    toastSubtle: (props: Dict) => {
      const { colorScheme: c } = props

      const style = {
        container: {
          bg: `tokenxyz.${c}.200`,
          py: 4,
          color: `tokenxyz.${c}.500`,
        },
        icon: {
          color: `tokenxyz.${c}.500`,
        },
      }

      // Edge cases, maybe we'll need to completely replace the green and blue color pallettes
      if (c === "blue") {
        style.container.bg = "tokenxyz.blue.100"
        style.container.color = "tokenxyz.blue.400"
        style.icon.color = "tokenxyz.blue.400"
      }

      if (c === "green") {
        style.container.bg = "tokenxyz.green.500"
        style.container.color = "tokenxyz.green.700"
        style.icon.color = "tokenxyz.green.700"
      }

      return style
    },
    ghost: (props: Dict) => {
      const { colorScheme: c } = props
      return {
        container: {
          bg: "transparent",
          px: 0,
          alignItems: "flex-start",
        },
        icon: {
          color: mode(`${c}.500`, `${c}.200`)(props),
        },
      }
    },
  },
}

export default styles
