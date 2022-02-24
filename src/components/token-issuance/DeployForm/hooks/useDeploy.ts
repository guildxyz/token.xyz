import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { TokenIssuanceFormType } from "types"

const useDeploy = () => {
  const toast = useToast()

  const deployToken = (data: TokenIssuanceFormType) =>
    new Promise((resolve, rejects) => {
      console.log("SUBMITTED DATA", data)
      setTimeout(() => resolve({ success: true }), 4000)
      // rejects(new Error("This is a mock error message"))
    })

  return useSubmit<any, any>(deployToken, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successful token issuance!",
      })
    },
    onError: (error) => {
      toast({
        status: "error",
        title: "Uh-oh!",
        description: error?.message || "Something went wrong",
      })
    },
  })
}

export default useDeploy
