import { Button, Flex, SimpleGrid } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Timeline from "components/common/Timeline"
import TimelineItem from "components/common/Timeline/components/TimelineItem"
import useTimeline from "components/common/Timeline/hooks/useTimeline"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import TokenIssuancePreview from "components/token-issuance/TokenIssuancePreview"
import { FormProvider, useForm } from "react-hook-form"

const STEPS: Array<{ title: string; content: JSX.Element; preview: any }> = [
  {
    title: "Token Issuance",
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
  const methods = useForm({ mode: "all" })

  const { next, prev, activeItem } = useTimeline()

  return (
    <Layout title="Token issuance">
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
            {STEPS.map(({ title, preview }) => (
              <TimelineItem key={title} title={title}>
                {preview}
              </TimelineItem>
            ))}
          </Timeline>
        </SimpleGrid>
      </FormProvider>
    </Layout>
  )
}

export default Page
