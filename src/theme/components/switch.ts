type Dict = Record<string, any>

const variantStrong = (props: Dict) => {
  const { colorScheme: c } = props

  return {
    track: {
      _checked: {
        bg: `${c}.500`,
      },
    },
  }
}

const styles = {
  variants: {
    strong: variantStrong,
  },
}

export default styles
