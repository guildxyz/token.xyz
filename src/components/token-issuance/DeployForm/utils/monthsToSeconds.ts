const monthsToSecond = (months: number): number =>
  months ? Math.floor(months * 2629743.83) : 0

export default monthsToSecond
