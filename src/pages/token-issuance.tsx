import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react"
import DynamicDevTool from "components/common/DynamicDevTool"
import Layout from "components/common/Layout"
import Timeline from "components/common/Timeline"
import { TimelineProvider } from "components/common/Timeline/components/TImelineContext"
import CurrentForm from "components/token-issuance/CurrentForm"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import TokenIssuancePreview from "components/token-issuance/TokenIssuancePreview"
import { ChartLine, Coin, CurrencyEth } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { TimelineSteps } from "types"
import { useAccount } from "wagmi"

const STEPS: TimelineSteps = [
  {
    title: "Token Issuance",
    icon: <Icon as={Coin} />,
    content: <TokenIssuanceForm />,
    preview: <TokenIssuancePreview />,
  },
  {
    title: "Distribution (optional)",
    icon: <Icon as={ChartLine} />,
    content: <DistributionForm />,
    preview: "Distribution preview",
  },
  {
    title: "Deploy",
    icon: <Icon as={CurrencyEth} />,
    content: <DeployForm />,
    preview: "Deploy preview",
  },
]

const Page = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const methods = useForm({ mode: "all" })

  return (
    <Layout title="Token issuance">
      {accountData?.address ? (
        <FormProvider {...methods}>
          <TimelineProvider steps={STEPS}>
            <SimpleGrid gridTemplateColumns="2fr 1fr" gap={8}>
              <Flex minH="60vh" direction="column">
                <CurrentForm />
              </Flex>

              <Timeline />
            </SimpleGrid>
          </TimelineProvider>

          <DynamicDevTool control={methods.control} />
        </FormProvider>
      ) : (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>
            Please connect your wallet in order to continue!
          </AlertDescription>
        </Alert>
      )}
    </Layout>
  )
}

export default Page
