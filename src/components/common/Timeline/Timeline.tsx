import { Box, useBreakpointValue } from "@chakra-ui/react"
import { useTimeline } from "./components/TimelineContext"
import TimelineItem from "./components/TimelineItem"

const Timeline = (): JSX.Element => {
  const { steps, activeItem, setActive } = useTimeline()
  const timelineProps = useBreakpointValue({
    base: {},
    md: {
      sx: {
        position: "sticky",
        top: 8,
      },
    },
  })

  return (
    <>
      <Box mb={6} h={20} /> {/* TODO: Find a better solution... */}
      <Box {...timelineProps}>
        {steps?.map((step, index) => (
          <TimelineItem
            key={step.title}
            title={step.title}
            icon={step.icon}
            onClick={() => setActive(index)}
            active={index <= activeItem}
            completed={index < activeItem}
          >
            {step.preview}
          </TimelineItem>
        ))}
      </Box>
    </>
  )
}

export default Timeline
