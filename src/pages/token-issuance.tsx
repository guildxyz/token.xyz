import { Button, Flex } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Layout from "components/common/Layout"
import DeployForm from "components/token-issuance/DeployForm"
import DistributionForm from "components/token-issuance/DistributionForm"
import TokenIssuanceForm from "components/token-issuance/TokenIssuanceForm"
import { ReactNode } from "react"
import { FormProvider, useForm } from "react-hook-form"

const STEPS: Array<{ key: string; label: ReactNode; content: () => JSX.Element }> = [
  { key: "token-issuance", label: "Token Issuance", content: TokenIssuanceForm },
  {
    key: "distribution",
    label: "Distribution (optional)",
    content: DistributionForm,
  },
  { key: "deploy", label: "Deploy", content: DeployForm },
]

const Page = (): JSX.Element => {
  const methods = useForm({ mode: "all" })

  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Layout title="Token issuance">
      <FormProvider {...methods}>
        <Flex flexDir="column" width="100%">
          <Steps activeStep={activeStep} orientation="vertical" colorScheme="cyan">
            {STEPS.map(({ key, label, content }) => (
              <Step label={label} key={key}>
                {content}
              </Step>
            ))}
          </Steps>

          <Flex width="100%" justify="flex-end">
            <Button
              isDisabled={activeStep === 0}
              mr={4}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {activeStep === STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        </Flex>
      </FormProvider>
    </Layout>
  )
}

export default Page
