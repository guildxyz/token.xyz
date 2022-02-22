import { Heading } from "@chakra-ui/react"
import Meta from "components/common/Meta"
import { useTimeline } from "components/common/Timeline/components/TImelineContext"

const DynamicPageTitle = (): JSX.Element => {
  const { steps, activeItem } = useTimeline()

  if (!steps?.[activeItem]?.title) return null

  return (
    <>
      <Meta title={steps[activeItem].title} />
      <Heading
        as="h2"
        mb={8}
        fontFamily="display"
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
      >
        {steps[activeItem].title}
      </Heading>
    </>
  )
}

export default DynamicPageTitle
