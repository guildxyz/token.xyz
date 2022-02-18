import { Button, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react"
import DynamicDevTool from "components/common/DynamicDevTool"
import Layout from "components/common/Layout"
import Timeline from "components/common/Timeline"
import TimelineItem from "components/common/Timeline/components/TimelineItem"
import useTimeline from "components/common/Timeline/hooks/useTimeline"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import TokenIssuancePreview from "components/token-issuance/TokenIssuancePreview"
import { Coin } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { useAccount } from "wagmi"

const STEPS: Array<{
  title: string
  icon?: JSX.Element
  content: JSX.Element
  preview: any
}> = [
  {
    title: "Token Issuance",
    icon: <Icon as={Coin} />,
    content: <TokenIssuanceForm />,
    preview: <TokenIssuancePreview />,
  },
  {
    title: "Distribution (optional)",
    content: <DistributionForm />,
    preview: "Distribution preview",
  },
  { title: "Deploy", content: <DeployForm />, preview: "Deploy preview" },
]

const Page = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const methods = useForm({ mode: "all" })
  const { next, prev, activeItem } = useTimeline()

  return (
    <Layout title="Token issuance">
      {accountData?.address ? (
        <FormProvider {...methods}>
          <SimpleGrid gridTemplateColumns="2fr 1fr" gap={8}>
            <Flex minH="60vh" direction="column">
              {STEPS[activeItem]?.content}

              <Flex mt="auto" width="100%" justify="flex-end">
                <Button
                  isDisabled={activeItem === 0}
                  mr={4}
                  onClick={prev}
                  size="sm"
                  variant="ghost"
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  onClick={activeItem === STEPS.length - 1 ? undefined : next}
                  isDisabled={activeItem === STEPS.length}
                >
                  {activeItem >= STEPS.length - 1 ? "Finish" : "Next"}
                </Button>
              </Flex>
            </Flex>

            <Timeline activeItem={activeItem}>
              {STEPS.map(({ title, icon, preview }) => (
                <TimelineItem key={title} title={title} icon={icon}>
                  {preview}
                </TimelineItem>
              ))}
            </Timeline>
          </SimpleGrid>

          <DynamicDevTool control={methods.control} />
        </FormProvider>
      ) : (
        <Text>EYYYO, log in pls!</Text>
      )}
    </Layout>
  )
}

export default Page
