import { useTimeline } from "components/common/Timeline/components/TimelineContext"
import { AnimatePresence, motion } from "framer-motion"

const framerMotionVariants = {
  enter: {
    // x: 500,
    opacity: 0,
  },
  center: {
    // zIndex: 1,
    // x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    // x: -500,
    opacity: 0,
  },
}

const CurrentForm = (): JSX.Element => {
  const { steps, activeItem } = useTimeline()
  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <motion.div
        key={activeItem}
        variants={framerMotionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        {steps[activeItem]?.content}
      </motion.div>
    </AnimatePresence>
  )
}

export default CurrentForm
