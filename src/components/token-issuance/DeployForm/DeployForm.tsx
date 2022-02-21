import { Stack } from "@chakra-ui/react"
import AcceptCorrectData from "./components/AcceptCorrectData"
import DeployButtons from "./components/DeployButtons"
import DistributionData from "./components/DistributionData"
import GeneralTokenData from "./components/GeneralTokenData"

const DeployForm = (): JSX.Element => (
  <Stack spacing={8} w="full">
    <GeneralTokenData />
    <DistributionData />
    <AcceptCorrectData />
    <DeployButtons />
  </Stack>
)

export default DeployForm
