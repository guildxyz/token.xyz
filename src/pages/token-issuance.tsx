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
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { ChartLine, Coin, CurrencyEth } from "phosphor-react"
import { useEffect } from "react"
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
  const { openWalletSelectorModal, triedEager } = useWeb3ConnectionManager()
  const methods = useForm<TokenIssuanceFormType>({ mode: "all" })

  useEffect(() => {
    if (loading || accountData || !triedEager) return
    openWalletSelectorModal()
  }, [loading, accountData, openWalletSelectorModal, triedEager])

  useWarnIfUnsavedChanges(methods?.formState?.isDirty)

  return (
    <ConfettiProvider>
      <Layout splitBg={!!accountData?.address}>
        {accountData?.address ? (
          <FormProvider {...methods}>
            <TimelineProvider steps={STEPS}>
              <SimpleGrid
                mt={-20}
                columns={{ base: 1, md: 7 }}
                columnGap={8}
                minH="100vh"
              >
                <GridItem
                  colSpan={{ base: 1, md: 5 }}
                  minW={0}
                  pr={{ base: 0, md: 8 }}
                  pt={20} // TODO: find a better solution...
                  pb={8}
                  bgColor="tokenxyz.rosybrown.100"
                >
                  <DynamicPageTitle />
                  <CurrentForm />
                </GridItem>

                <GridItem
                  colSpan={{ base: 1, md: 2 }}
                  minW={0}
                  display={{ base: "none", md: "block" }}
                >
                  <Timeline />
                </GridItem>
              </SimpleGrid>
            </TimelineProvider>

            <DynamicDevTool control={methods.control} />
          </FormProvider>
        ) : (
          <Alert
            status="error"
            bgColor="tokenxyz.red.100"
            color="tokenxyz.red.500"
            borderColor="tokenxyz.red.500"
          >
            <AlertIcon color="tokenxyz.red.500" />
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
