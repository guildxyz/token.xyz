import {
  Stat,
  StatGroup,
  StatHelpText,
  StatNumber,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useTimer } from "react-timer-hook"

type Props = {
  expiryTimestamp: number
  onExpire?: () => void
}

const Countdown = ({ expiryTimestamp, onExpire }: Props): JSX.Element => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(expiryTimestamp),
    onExpire,
  })
  const statSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" })

  return (
    <StatGroup maxW="max-content" gap={6} textAlign="center">
      {!!days && (
        <Stat size={statSize}>
          <StatNumber>{days}</StatNumber>
          <StatHelpText mb="0">Days</StatHelpText>
        </Stat>
      )}
      <Stat size={statSize}>
        <StatNumber>{hours}</StatNumber>
        <StatHelpText mb="0">Hours</StatHelpText>
      </Stat>
      <Stat size={statSize}>
        <StatNumber>{minutes}</StatNumber>
        <StatHelpText mb="0">Minutes</StatHelpText>
      </Stat>
      <Stat size={statSize}>
        <StatNumber>{seconds}</StatNumber>
        <StatHelpText mb="0">Seconds</StatHelpText>
      </Stat>
    </StatGroup>
  )
}

export default Countdown
