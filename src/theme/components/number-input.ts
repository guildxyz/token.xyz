import { numberInputAnatomy as parts } from "@chakra-ui/anatomy"
import type { PartsStyleObject } from "@chakra-ui/theme-tools"
import Input from "./input"

const { variants, defaultProps } = Input

type Size = "xs" | "sm" | "md" | "lg"

function getSize(size: Size): PartsStyleObject<typeof parts> {
  const sizeStyle = Input.sizes[size]

  const radius: Record<Size, string> = {
    lg: "xl",
    md: "xl",
    sm: "lg",
    xs: "md",
  }

  return {
    field: {
      ...sizeStyle.field,
    },
    stepper: {
      borderRightWidth: 1,
      color: "tokenxyz.rosybrown.500",
      borderColor: "tokenxyz.rosybrown.500",
      _first: {
        bgColor: "tokenxyz.rosybrown.300",
        borderTopWidth: 1,
        borderTopEndRadius: radius[size],
      },
      _last: {
        bgColor: "tokenxyz.rosybrown.300",
        borderTopWidth: 1,
        borderBottomEndRadius: radius[size],
        borderBottomWidth: 1,
      },
    },
  }
}

const sizes = {
  xs: getSize("xs"),
  sm: getSize("sm"),
  md: getSize("md"),
  lg: getSize("lg"),
}

export default {
  parts: parts.keys,
  sizes,
  variants,
  defaultProps,
}
