const processContractInteractionError = (err: any): string => {
  if (err?.message) return err?.message

  const firstSplit = err.toString().split("(")

  if (firstSplit[1]) {
    // Return a more specific error message
    const errorObj = firstSplit[1].split(", ")[0].replace("error=", "")
    try {
      const error = JSON.parse(errorObj)
      return error.message
    } catch (_) {
      return "An unknown error occurred!"
    }
  }

  // Return the "general" error message
  return err.toString().split("(")[0]
}

export default processContractInteractionError
