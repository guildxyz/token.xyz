import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import Chart from "./DistributionForm/components/Chart"

const DistributionPreview = (): JSX.Element => {
  const { control } = useFormContext<TokenIssuanceFormType>()
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const maxSupply = useWatch({ control, name: "maxSupply" })

  if (!initialSupply && !maxSupply) return null

  return <Chart isSimple />
}

export default DistributionPreview
