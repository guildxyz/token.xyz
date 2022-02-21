import { useTimeline } from "components/common/Timeline/components/TImelineContext"

const CurrentForm = (): JSX.Element => {
  const { steps, activeItem } = useTimeline()
  return steps[activeItem]?.content
}

export default CurrentForm
