import { useMachine } from "@xstate/react"
import useToast from "hooks/useToast"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import { useEffect, useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"
import { assign, createMachine } from "xstate"

const useDeploy = () => {
  const [{ data: accountData }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const { getValues } = useFormContext()

  const [
    urlName,
    tokenName,
    tokenTicker,
    decimals,
    initialSupply,
    transferOwnershipTo,
    mintable,
    multiOwner,
  ] = getValues([
    "urlName",
    "tokenName",
    "tokenTicker",
    "decimals",
    "initialSupply",
    "transferOwnershipTo",
    "mintable",
    "multiOwner",
  ])

  const toast = useToast()

  const deployMachine = useRef(
    createMachine<{ error?: any; response?: any }>(
      {
        id: "deployMachine",
        initial: "idle",
        context: {},
        states: {
          idle: {
            on: {
              DEPLOY: { target: "deploying" },
            },
          },
          deploying: {
            invoke: {
              src: "createToken",
              onDone: {
                target: "distributing",
                actions: ["assignDataToContext"],
              },
              onError: {
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
              },
            },
          },
          distributing: {
            invoke: {
              src: "distributeToken",
              onDone: {
                target: "finished",
                actions: ["assignDataToContext"],
              },
              onError: {
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
              },
            },
          },
          finished: {
            type: "final",
            entry: "onSuccess",
          },
        },
      },
      {
        actions: {
          clearError: assign({
            error: undefined,
          }),
          assignErrorToContext: assign((_context, event) => ({
            error: event.data?.reason || "An unknown error occurred",
          })),
          assignDataToContext: assign((_context, event) => ({
            response: event?.data,
          })),
          onSuccess: (_context) => {
            if (process.env.NODE_ENV === "development")
              console.log("createToken:success", _context.response)

            toast({
              status: "success",
              title: "Successful token issuance!",
            })
          },
          onError: (_context) => {
            if (process.env.NODE_ENV === "development")
              console.log("createToken:error", _context, event)

            toast({
              status: "error",
              title: "Uh-oh!",
              description: _context.error || "Something went wrong",
            })
          },
        },
      }
    )
  )

  const [state, send] = useMachine(deployMachine.current, {
    services: {
      createToken: () =>
        tokenXyzContract
          .createToken(
            urlName,
            tokenName,
            tokenTicker,
            decimals || 18,
            initialSupply,
            transferOwnershipTo || accountData?.address,
            mintable,
            multiOwner
          )
          .then((res) => res.wait()),
      distributeToken: () =>
        new Promise((resolve) => setTimeout(() => resolve({}), 1000)),
    },
  })

  // DEBUG
  useEffect(() => {
    console.log("MACHINE STATE", state)
  }, [state])

  const startDeploy = () => send("DEPLOY")

  const isLoading = useMemo(
    () =>
      !state.matches("idle") &&
      !state.matches("finished") &&
      !state.matches("error"),
    [state]
  )

  const loadingText = useMemo(() => {
    if (state.matches("deploying")) return "Creating token"
    else if (state.matches("distributing")) return "Distributing token"
    else return "Loading"
  }, [state])

  const finished = useMemo(() => state.matches("finished"), [state])

  return { startDeploy, isLoading, loadingText, finished }
}

export default useDeploy
