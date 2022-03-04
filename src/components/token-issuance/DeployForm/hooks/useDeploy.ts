import { useMachine } from "@xstate/react"
import useToast from "hooks/useToast"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import { useEffect, useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import { useAccount } from "wagmi"
import { assign, createMachine } from "xstate"

const useDeploy = () => {
  const [{ data: accountData }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const { getValues } = useFormContext<TokenIssuanceFormType>()

  const [
    urlName,
    tokenName,
    tokenTicker,
    decimals,
    initialSupply,
    maxSupply,
    transferOwnershipTo,
    mintable,
    distributionData,
  ] = getValues([
    "urlName",
    "tokenName",
    "tokenTicker",
    "decimals",
    "initialSupply",
    "maxSupply",
    "transferOwnershipTo",
    "mintable",
    "distributionData",
  ])

  const toast = useToast()

  const deployMachine = useRef(
    createMachine<{
      error?: string
      response?: Record<string, any>
    }>(
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
            error:
              event.data?.reason ||
              event.data?.message ||
              "An unknown error occurred",
          })),
          assignDataToContext: assign((_context, event) => ({
            response: event?.data,
          })),
          onSuccess: (_context) =>
            toast({
              status: "success",
              title: "Successful token issuance!",
            }),
          onError: (_context, event) => {
            if (process.env.NODE_ENV === "development")
              console.log("createToken:error", _context, event)

            toast({
              status: "error",
              title: "Uh-oh!",
              description: _context.error,
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
            maxSupply,
            transferOwnershipTo || accountData?.address,
            mintable
          )
          .then((res) => res.wait()),
      distributeToken: async (_context) => {
        // If there's no distribution data, we can skip this step
        if (!distributionData?.length) send("SKIP_DISTRIBUTION")

        const tokenDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "TokenDeployed"
        )
        // TODO: Maybe we don't event need this here, since if the deployment was successful, we should know the token data already...
        if (!tokenDeployedEvent) Promise.reject("Could not deploy token contract.")

        const [, , tokenAddress] = tokenDeployedEvent.args
        // If we know the token address & the user provided distribution data, we should start distributing the tokens
        console.log("Token address:", tokenAddress)

        // TODO: distribute tokens...
        return new Promise((resolve) => setTimeout(() => resolve({}), 1000))
      },
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
