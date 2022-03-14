import { createContext, PropsWithChildren, useContext } from "react"
import { AllocationJSON } from "types"

const AllocationContext = createContext<AllocationJSON>(null)

type Props = {
  initialData: AllocationJSON
}

const AllocationProvider = ({
  initialData,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <AllocationContext.Provider value={initialData}>
    {children}
  </AllocationContext.Provider>
)

const useAllocation = () => useContext(AllocationContext)

export { useAllocation, AllocationProvider }
