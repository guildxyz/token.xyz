import {
  Alert,
  AlertDescription,
  AlertIcon,
  GridItem,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react"
import { ConfettiProvider } from "components/common/ConfettiContext"
import Layout from "components/common/Layout"
import Timeline from "components/common/Timeline"
import { TimelineProvider } from "components/common/Timeline/components/TimelineContext"
import DynamicDevTool from "components/forms/DynamicDevTool"
import CurrentForm from "components/token-issuance/CurrentForm"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import DistributionPreview from "components/token-issuance/DistributionPreview"
import DynamicPageTitle from "components/token-issuance/DynamicPageTitle"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import TokenIssuancePreview from "components/token-issuance/TokenIssuancePreview"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { ChartLine, Coin, CurrencyEth } from "phosphor-react"
import { useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { TimelineSteps, TokenIssuanceFormType } from "types"
import { useAccount } from "wagmi"

const STEPS: TimelineSteps = [
  {
    title: "Token Issuance",
    icon: <Icon as={Coin} />,
    content: <TokenIssuanceForm />,
    preview: <TokenIssuancePreview />,
  },
  {
    title: "Distribution",
    icon: <Icon as={ChartLine} />,
    content: <DistributionForm />,
    preview: <DistributionPreview />,
  },
  {
    title: "Deploy",
    icon: <Icon as={CurrencyEth} />,
    content: <DeployForm />,
  },
]

const Page = (): JSX.Element => {
  const [{ data: accountData, loading }] = useAccount()
  const { openWalletSelectorModal, triedEager } = useContext(Web3Connection)
  const methods = useForm<TokenIssuanceFormType>({ mode: "all" })

  useEffect(() => {
    if (loading || accountData || !triedEager) return
    openWalletSelectorModal()
  }, [loading, accountData, openWalletSelectorModal, triedEager])

  return (
    <ConfettiProvider>
      <Layout>
        {accountData?.address ? (
          <FormProvider {...methods}>
            <TimelineProvider steps={STEPS}>
              <DynamicPageTitle />

              <SimpleGrid
                gridTemplateColumns={{ base: "1fr", md: "2fr 1fr" }}
                gap={8}
              >
                <GridItem minW={0}>
                  <CurrentForm />
                </GridItem>

                <GridItem minW={0} display={{ base: "none", md: "block" }}>
                  <Timeline />
                </GridItem>
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
    </ConfettiProvider>
  )
}

export default Page
