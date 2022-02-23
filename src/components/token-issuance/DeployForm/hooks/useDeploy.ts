import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"

const useDeploy = () => {
  const toast = useToast()

  const mockDeployToken = () =>
    new Promise((resolve, rejects) => {
      setTimeout(() => resolve({ success: true }), 4000)
      // rejects(new Error("This is a mock error message"))
    })

  return useSubmit<any, any>(mockDeployToken, {
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
