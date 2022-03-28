import { mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantSolid(props: Dict) {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)
    const disabledBg = mode(`gray.200`, `whiteAlpha.300`)(props)

    return {
      bg,
      _disabled: { bg: disabledBg },
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg: disabledBg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    }
  }

  const bg = `${c}.500`

  return {
    bg,
    color: "white",
    _hover: {
      bg: mode(`${c}.600`, `${c}.400`)(props),
      _disabled: { bg },
    },
    _active: { bg: mode(`${c}.700`, `${c}.300`)(props) },
  }
}

const variantSolidStatic = (props: Dict) => {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)

    return {
      bg,
    }
  }

  return {
    bg: mode(`${c}.500`, `${c}.200`)(props),
    color: mode("white", `gray.800`)(props),
  }
}

const variantOutline = (props: Dict) => {
  const { theme, colorScheme: c } = props

  const style: Record<string, any> = {
    border: "2px solid",
    borderColor:
      c !== "gray"
        ? mode(`${c}.500`, transparentize(`${c}.300`, 0.8)(theme))(props)
        : undefined,
  }

  const extendedStyle =
    c === "tokenxyz.rosybrown"
      ? {
          bgColor: "tokenxyz.white",
          _focus: {
            bgColor: "tokenxyz.white",
          },
        }
      : {}

  return { ...style, ...extendedStyle }
}

const styles = {
  baseStyle: (props: Dict) => {
    const { colorScheme: c, borderRadius, variant } = props
    const baseBoxShadow =
      variant !== "unstyled" && variant !== "outline"
        ? `${
            borderRadius === "full" ? "0" : "0"
          } 4px 0 var(--chakra-colors-tokenxyz-black)`
        : undefined
    const translate =
      variant !== "unstyled" && variant !== "outline"
        ? `translate(0, 4px)`
        : undefined

    return {
      position: "relative",
      boxShadow: baseBoxShadow,
      borderRadius: "xl",
      _focusVisible: {
        boxShadow: baseBoxShadow,
        transform: "none",
      },
      _focus: {
        boxShadow: baseBoxShadow,
        bgColor: `${c}.400`,
        transform: translate,
      },
      _active: {
        boxShadow: "0 0 0 var(--chakra-colors-tokenxyz-black)",
        transform: translate,
      },
    }
  },
  sizes: {
    md: {
      h: "var(--chakra-space-11)",
    },
    xl: {
      fontSize: "lg",
      h: 14,
      px: 8,
    },
  },
  variants: {
    solid: variantSolid,
    solidStatic: variantSolidStatic,
    outline: variantOutline,
  },
}

export default styles
