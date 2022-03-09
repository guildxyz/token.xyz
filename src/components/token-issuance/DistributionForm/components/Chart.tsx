import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip as ChartTooltip,
} from "chart.js"
import "chartjs-adapter-moment"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartTooltip,
  Filler,
  TimeScale
)

const getCurrentMonth = (index: number) => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + index, 1).toString()
}

// TODO: generate colors dynamicall?
const CHART_COLORS: Array<{ bg: string; border: string }> = [
  // Cyan
  {
    bg: "#76E4F7",
    border: "#00B5D8",
  },
  // Pink
  {
    bg: "#F687B3",
    border: "#D53F8C",
  },
  // Teal
  {
    bg: "#4FD1C5",
    border: "#319795",
  },
]

type Props = {
  isSimple?: boolean
}

const Chart = ({ isSimple }: Props): JSX.Element => {
  const { control, getValues } = useFormContext<TokenIssuanceFormType>()

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

    const rawLongestDistributionDuration =
      distributionData?.length &&
      distributionData.some((allocation) => allocation.distributionDuration != 0)
        ? Math.max(
            ...distributionData.map(
              (allocationData) => allocationData.distributionDuration
            ),
            12
          ) + 1
        : 13

    const longestDistributionDuration =
      rawLongestDistributionDuration > 120 ? 120 : rawLongestDistributionDuration

    return {
      // Get the longest istribution duration, and just create an array of that length
      datasets: [
        {
          label: "Token owner",
          data: Array(longestDistributionDuration)
            .fill(0)
            .map((_, i) => ({
              x: getCurrentMonth(i),
              y: initialSupply - (distributedSupply || 0),
            })),
          borderColor: "#718096",
          backgroundColor: "#CBD5E0",
          fill: "origin",
        },
      ].concat(
        distributionData?.map((allocationData, index) => ({
          label: getValues(`distributionData.${index}.allocationName`),
          data: Array(longestDistributionDuration)
            .fill(0)
            .map((_, i) => {
              const cliff = allocationData.cliff || 0

              // TODO: double-check if this logic is right...
              const multiplier = (num: number) =>
                cliff > 0 && num <= cliff
                  ? 0
                  : num > allocationData.vestingPeriod
                  ? allocationData.vestingPeriod - cliff
                  : num - cliff

              // Linear vesting
              if (allocationData.vestingType === "LINEAR_VESTING")
                return {
                  x: getCurrentMonth(i),
                  y: Math.round(
                    (allocationData.allocationAddressesAmounts
                      ?.map((data) => parseFloat(data.amount))
                      ?.reduce((a, b) => a + b, 0) /
                      allocationData.vestingPeriod -
                      cliff) *
                      multiplier(i)
                  ),
                }

              // No vesting
              return {
                x: getCurrentMonth(i),
                y: Math.round(
                  allocationData.allocationAddressesAmounts
                    ?.map((data) => parseFloat(data.amount))
                    ?.reduce((a, b) => a + b, 0)
                ),
              }
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
            display: !isSimple,
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month",
            },
            ticks: {
              display: !isSimple,
            },
          },
          y: {
            min: 0,
            stacked: true,
            ticks: {
              display: !isSimple,
            },
          },
        },
        color: "#ffffff",
      }}
      data={dynamicChartData}
    />
  )
}

export default Chart
