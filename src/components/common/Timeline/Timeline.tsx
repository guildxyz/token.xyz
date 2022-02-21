import { Box } from "@chakra-ui/react"
import { useTimeline } from "./components/TImelineContext"
import TimelineItem from "./components/TimelineItem"

const Timeline = (): JSX.Element => {
  const { steps, activeItem, setActive } = useTimeline()

  return (
    <Box>
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
  )
}

export default Timeline
