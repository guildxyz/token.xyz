import { Button, Flex, SimpleGrid } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Layout from "components/common/Layout"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import TokenIssuancePreview from "components/token-issuance/TokenIssuancePreview"
import { FormProvider, useForm } from "react-hook-form"

const STEPS: Array<{ label: string; content: JSX.Element; preview: any }> = [
  {
    label: "Token Issuance",
    content: <TokenIssuanceForm />,
    preview: <TokenIssuancePreview />,
  },
  {
    label: "Distribution (optional)",
    content: <DistributionForm />,
    preview: "Distribution preview",
  },
  { label: "Deploy", content: <DeployForm />, preview: "Deploy preview" },
]

const Page = (): JSX.Element => {
  const methods = useForm({ mode: "all" })

  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Layout title="Token issuance">
      <FormProvider {...methods}>
        <SimpleGrid gridTemplateColumns="2fr 1fr" gap={8}>
          <Flex minH="60vh" direction="column">
            {STEPS[activeStep].content}

            <Flex mt="auto" width="100%" justify="flex-end">
              <Button
                isDisabled={activeStep === 0}
                mr={4}
                onClick={prevStep}
                size="sm"
                variant="ghost"
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={activeStep === STEPS.length ? undefined : nextStep}
                isDisabled={activeStep === STEPS.length}
              >
                {activeStep >= STEPS.length - 1 ? "Finish" : "Next"}
              </Button>
            </Flex>
          </Flex>

          <Steps activeStep={activeStep} colorScheme="cyan" orientation="vertical">
            {STEPS.map(({ label, preview }) => (
              <Step key={label} label={label}>
                {preview}
              </Step>
            ))}
          </Steps>
        </SimpleGrid>
      </FormProvider>
    </Layout>
  )
}

export default Page
