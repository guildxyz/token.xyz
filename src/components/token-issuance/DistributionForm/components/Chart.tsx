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
  return new Date(
    date.getFullYear(),
    date.getMonth() + index,
    date.getDate()
  ).toString()
}

// TODO: generate colors dynamicall?
const CHART_COLORS: Array<{ bg: string; border: string }> = [
  // TokenXZY Red
  {
    bg: "#C65D7B",
    border: "#C65D7B",
  },
  // TokenXZY Blue
  {
    bg: "#1C658C",
    border: "#1C658C",
  },
  // TokenXYZ Dark Tan
  {
    bg: "#D4ACA0",
    border: "#D4ACA0",
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
            allocationData.allocationAddressesAmounts?.map((data) =>
              parseFloat(data.amount)
            )
          )
          ?.reduce((arr1, arr2) => [...(arr1 || []), ...(arr2 || [])])
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
          )
        : 12

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
          // TokenXYZ Green
          borderColor: "#B4C6A6",
          backgroundColor: "#B4C6A6",
          fill: "origin",
        },
      ].concat(
        distributionData?.map((allocationData, index) => {
          const amountToAllocate = allocationData.allocationAddressesAmounts
            ?.map((data) => parseFloat(data.amount))
            ?.reduce((a, b) => a + b, 0)

          return {
            label: getValues(`distributionData.${index}.allocationName`),
            data: Array(longestDistributionDuration)
              .fill(0)
              .map((_, i) => {
                const cliff = allocationData.cliff || 0

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
                      (amountToAllocate / (allocationData.vestingPeriod - cliff)) *
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
          }
        }) || []
      ),
    }
  }, [initialSupply, distributionData])

  return (
    <Line
      options={{
        elements: {
          point: {
            radius: isSimple ? 0 : undefined,
          },
        },
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
              color: "#AF644F", // Rosybrown 600
            },
          },
          y: {
            min: 0,
            stacked: true,
            ticks: {
              display: !isSimple,
              color: "#AF644F", // Rosybrown 600,
            },
          },
        },
        color: "#AF644F", // Rosybrown 600
      }}
      data={dynamicChartData}
    />
  )
}

export default Chart
