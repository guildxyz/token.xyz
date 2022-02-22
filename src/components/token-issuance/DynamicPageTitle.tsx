import { Heading, HStack, Icon, IconButton } from "@chakra-ui/react"
import Meta from "components/common/Meta"
import { useTimeline } from "components/common/Timeline/components/TImelineContext"
import { ArrowLeft } from "phosphor-react"

const DynamicPageTitle = (): JSX.Element => {
  const { steps, activeItem, prev } = useTimeline()

  if (!steps?.[activeItem]?.title) return null

  return (
    <>
      <Meta title={steps[activeItem].title} />
      <HStack alignItems="center" mb={8}>
        {activeItem > 0 && (
          <IconButton
            aria-label="Back"
            isRound
            mt={1}
            boxSize={8}
            minWidth={8}
            minHeight={8}
            icon={<Icon as={ArrowLeft} />}
            onClick={prev}
          />
        )}
        <Heading
          as="h2"
          fontFamily="display"
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        >
          {steps[activeItem].title}
        </Heading>
      </HStack>
    </>
  )
}

export default DynamicPageTitle
