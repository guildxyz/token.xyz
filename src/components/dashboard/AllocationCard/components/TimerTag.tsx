import { Spinner, Tag } from "@chakra-ui/react"
import { useMemo } from "react"
import { useTimer } from "react-timer-hook"

type Props = {
  expirityTime: number
}

const TimerTag = ({ expirityTime }: Props): JSX.Element => (
  <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
    {expirityTime ? (
      <TimerWithData expirityTime={expirityTime} />
    ) : (
      <Spinner size="xs" />
    )}
  </Tag>
)

const TimerWithData = ({ expirityTime }: Props): JSX.Element => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(expirityTime),
    autoStart: false,
  })

  const ended = useMemo(
    () => !days && !hours && !minutes && !seconds,
    [days, hours, minutes, seconds]
  )

  return (
    <>
      {ended
        ? "Ended"
        : `Ends in ${
            days
              ? `${days} days`
              : hours
              ? `${hours} hours`
              : minutes
              ? `${minutes} minutes`
              : `${seconds} seconds`
          }`}
    </>
  )
}

export default TimerTag
