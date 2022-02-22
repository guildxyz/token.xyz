import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
} from "chart.js"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { useFormContext, useWatch } from "react-hook-form"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartTooltip,
  Filler
)

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const getMonthName = (index: number) => MONTHS[(index + new Date().getMonth()) % 12]

// TODO: generate colors dynamicall
const CHART_COLORS: Array<{ bg: string; border: string }> = [
  {
    bg: "rgba(239, 68, 68, 0.2)",
    border: "#EF4444",
  },
  {
    bg: "rgba(34, 197, 94, 0.2)",
    border: "#22C55E",
  },
  {
    bg: "rgba(99, 102, 241, 0.2)",
    border: "#6366F1",
  },
]

const Chart = (): JSX.Element => {
  const { control, getValues } = useFormContext()

  const initialSupply = useWatch({ control, name: "initialSupply" })
  const distributionData = useWatch({ name: "distributionData", control })

  const dynamicChartData = useMemo(() => {
    const distributedSupply = distributionData?.length
      ? distributionData
          ?.map((allocationData) =>
            allocationData.allocationAddressesAmounts?.map((data) => data.amount)
          )
          ?.reduce((arr1, arr2) => [...(arr1 || []), ...(arr2 || [])])
          ?.map((value) => parseInt(value))
          ?.reduce((a, b) => a + b, 0)
      : 0

    const longestVestingPeriod =
      distributionData?.length &&
      typeof distributionData[0].vestingPeriod === "number"
        ? Math.max(
            ...distributionData.map((allocationData) =>
              parseInt(allocationData.vestingPeriod)
            ),
            12
          )
        : 12

    return {
      // Get the longest vesting period, and just create an array of that length
      labels: Array(longestVestingPeriod)
        .fill(0)
        .map((_, index) => getMonthName(index)),
      datasets: [
        {
          label: "Token owner",
          data: Array(longestVestingPeriod).fill(
            parseInt(initialSupply) - parseInt(distributedSupply || 0)
          ),
          borderColor: "#fefefe",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          fill: "origin",
        },
      ].concat(
        distributionData?.map((allocationData, index) => ({
          label: getValues(`distributionData.${index}.allocationName`),
          // TODO: replace the const 5 with a dynamic value...
          data: Array(longestVestingPeriod)
            .fill(0)
            .map((_, i) => {
              const cliff = parseInt(allocationData.cliff) || 0
              const vestingPeriod =
                parseInt(allocationData.vestingPeriod) || longestVestingPeriod

              // TODO: double-check if this logic is right...
              const multiplier = (num: number) =>
                cliff > 0 && num < cliff
                  ? 0
                  : num >= vestingPeriod
                  ? vestingPeriod
                  : num + 1

              // Linear vesting
              if (allocationData.vestingType === "LINEAR_VESTING")
                return Math.round(
                  (allocationData.allocationAddressesAmounts
                    ?.map((data) => parseFloat(data.amount))
                    ?.reduce((a, b) => a + b, 0) /
                    vestingPeriod) *
                    multiplier(i)
                )

              // No vesting
              return Math.round(
                allocationData.allocationAddressesAmounts
                  ?.map((data) => parseFloat(data.amount))
                  ?.reduce((a, b) => a + b, 0)
              )
            }),
          borderColor: CHART_COLORS[index].border,
          backgroundColor: CHART_COLORS[index].bg,
          fill: "origin",
        })) || []
      ),
    }
  }, [initialSupply, distributionData])

  return (
    <Line
      options={{
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            stacked: true,
          },
        },
        color: "#ffffff",
      }}
      data={dynamicChartData}
    />
  )
}

export default Chart
