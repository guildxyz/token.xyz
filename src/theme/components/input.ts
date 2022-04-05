import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"

const size: Record<string, SystemStyleObject> = {
  lg: {
    borderRadius: "xl",
  },

  md: {
    borderRadius: "xl",
  },

  sm: {
    borderRadius: "lg",
  },

  xs: {
    borderRadius: "md",
  },
}

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  lg: {
    field: size.lg,
    addon: size.lg,
  },
  md: {
    field: size.md,
    addon: size.md,
  },
  sm: {
    field: size.sm,
    addon: size.sm,
  },
  xs: {
    field: size.xs,
    addon: size.xs,
  },
}

const variantOutline: PartsStyleFunction<typeof parts> = () => ({
  field: {
    overflow: "hidden",
    bg: "tokenxyz.white",
    borderWidth: 1,
    borderColor: "tokenxyz.rosybrown.500",
    color: "tokenxyz.black",
    _placeholder: {
      color: "tokenxyz.rosybrown.500",
    },
    _hover: {
      borderColor: "tokenxyz.rosybrown.500",
      bg: "tokenxyz.rosybrown.50",
    },
    _focus: {},
    _invalid: {
      borderColor: "tokenxyz.red.500",
    },
  },
  addon: {
    bg: "tokenxyz.rosybrown.200",
    borderColor: "tokenxyz.rosybrown.500",
  },
})

const variants = {
  outline: variantOutline,
}

const styles = {
  parts: ["field"],
  defaultProps: {
    focusBorderColor: "tokenxyz.rosybrown.500",
  },
  sizes,
  variants,
}

export default styles
