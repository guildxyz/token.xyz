const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: {
    dialog: {
      overflow: "hidden",
      marginTop: "auto",
      marginBottom: { base: 0, sm: "auto" },
      bgColor: "tokenxyz.white",
      color: "tokenxyz.rosybrown.500",
      borderRadius: "xl",
      boxShadow: "none",
      // we can't add data attributes to the Modal component so we have
      // to prevent the focus-visible polyfill from removing shadow on
      // focus by overriding it's style with the default box-shadow
      ":focus:not([data-focus-visible-added])": {
        boxShadow: "none",
      },
    },
    closeButton: {
      borderRadius: "full",
      top: 7,
      right: 7,
    },
    header: {
      pl: { base: 6, sm: 10 },
      pr: { base: 16, sm: 10 },
      py: 6,
      mb: 4,
      bgColor: "tokenxyz.rosybrown.300",
      fontSize: "2xl",
      fontFamily: "display",
      fontWeight: "bold",
      letterSpacing: "wider",
      color: "tokenxyz.blue.500",
      textShadow: "0 1.5px 0 var(--chakra-colors-tokenxyz-black)",
      borderBottomWidth: 2,
      borderBottomColor: "tokenxyz.rosybrown.500",
    },
    body: {
      px: { base: 6, sm: 10 },
      pt: { base: 1, sm: 2 },
      pb: { base: 9, sm: 10 },
    },
    footer: {
      px: { base: 6, sm: 10 },
      pt: 2,
      pb: 10,
      "> *": {
        w: "full",
      },
    },
  },
}

export default styles
