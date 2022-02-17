import { ErrorInfo } from "components/common/Error"

const processConnectionError = (error: Error): ErrorInfo => {
  switch (error.name) {
    case "ConnectorNotFoundError":
      return {
        title: "Connector not found",
        description:
          "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.",
      }
    default:
      return {
        title: error?.name ?? "An unknown error occurred",
        description: error?.message ?? "Check the console for more details.",
      }
  }
}

export default processConnectionError
