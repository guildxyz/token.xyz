import { Box } from "@chakra-ui/react"
import { Children, cloneElement, PropsWithChildren } from "react"

type Props = {
  activeItem: number
  setActive?: (i?: number) => void
}

const Timeline = ({
  activeItem,
  setActive,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const childrenArray = Children.toArray(children) as Array<JSX.Element>

  return (
    <Box>
      {childrenArray
        ?.filter((child) => child.type?.name === "TimelineItem")
        .map((child, index) =>
          cloneElement(child, {
            ...child.props,
            onClick: setActive ? () => setActive(index) : undefined,
            active: index <= activeItem,
            completed: index < activeItem,
          })
        )}
    </Box>
  )
}

export default Timeline
