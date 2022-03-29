import { Heading, HStack, Icon, IconButton } from "@chakra-ui/react"
import Meta from "components/common/Meta"
import { useTimeline } from "components/common/Timeline/components/TimelineContext"
import { ArrowLeft } from "phosphor-react"

const DynamicPageTitle = (): JSX.Element => {
  const { steps, activeItem, prev } = useTimeline()

  if (!steps?.[activeItem]?.title) return null

  return (
    <>
      <Meta title={`Token.xyz - ${steps[activeItem].title}`} />
      <HStack alignItems="center" py={6} spacing={4}>
        {activeItem > 0 && (
          <IconButton
            aria-label="Back"
            isRound
            colorScheme="tokenxyz.blue"
            position="relative"
            mt={-1}
            boxSize={10}
            minWidth={10}
            minHeight={10}
            icon={<Icon as={ArrowLeft} />}
            fontSize="sm"
            onClick={prev}
            _after={{
              content: "''",
              position: "absolute",
              inset: 1,
              borderRadius: "full",
              borderWidth: 2,
              borderColor: "tokenxyz.rosybrown.200",
            }}
          />
        )}
        <Heading
          as="h2"
          fontFamily="display"
          color="tokenxyz.red.500"
          textShadow="0 2px 0 var(--chakra-colors-tokenxyz-black)"
          letterSpacing="wider"
          fontSize={{ base: "3xl", sm: "5xl", md: "6xl" }}
        >
          {steps[activeItem].title}
        </Heading>
      </HStack>
    </>
  )
}

export default DynamicPageTitle
