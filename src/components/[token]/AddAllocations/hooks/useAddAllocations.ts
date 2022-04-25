import { useMachine } from "@xstate/react"
import sendTokensWithDisperse from "components/token-issuance/DeployForm/utils/sendTokensWithDisperse"
import useToast from "hooks/useToast"
import useTokenDataFromContract from "hooks/useTokenDataFromContract"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { AllocationFormType, TokenIssuanceFormType } from "types"
import { MerkleDistributorInfo } from "utils/merkle/parseBalanceMap"
import { useSigner } from "wagmi"
import { assign, createMachine } from "xstate"

const useAddAllocations = () => {
  const router = useRouter()
  const tokenAddress = router.query?.token?.toString()

  const [{ data: signerData }] = useSigner()
  const { data: tokenDataFromContract } = useTokenDataFromContract(tokenAddress)

  // TODO: how will we know if the user can still make airdrops? E.g. they haven't reached the max supply of the token already?

  const { getValues } = useFormContext<TokenIssuanceFormType>()
  const distributionData = getValues("distributionData")

  const toast = useToast()

  const addAllocationsMachine = useRef(
    createMachine<{
      tokenAddress?: string
      decimals?: number
      deployer?: string
      distributionData?: Array<AllocationFormType>
      error?: string
      response?: Record<string, any>
      merkleVestingContractAddress?: string
      merkleDistributorContractAddresses?: Array<string>
      merkleTrees?: Array<MerkleDistributorInfo>
      abiEncodedMerkleVestingArgs?: string
      abiEncodedMerkleDistributorArgs?: Array<string>
    }>(
      {
        id: "addAllocationsMachine",
        initial: "idle",
        context: {},
        states: {
          idle: {
            on: {
              START: { target: "setupInitialContext" },
            },
          },
          setupInitialContext: {
            invoke: {
              src: "setupInitialContext",
              onDone: {
                target: "sendingTokensWithDisperse",
              },
            },
            on: {
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
          },
          sendingTokensWithDisperse: {
            invoke: {
              src: "sendTokensWithDisperse",
              onDone: {
                target: "creatingMerkleContracts",
                actions: ["assignResponseToContext", "logResponse"], // Debug
              },
              onError: {
                target: "creatingMerkleContracts",
                actions: ["assignErrorToContext", "onDisperseError"],
              },
            },
            on: {
              SKIP: {
                target: "creatingMerkleContracts",
              },
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
          },
          creatingMerkleContracts: {
            invoke: {
              src: "createMerkleContracts",
              onDone: {
                target: "creatingCohorts",
                actions: ["assignResponseToContext", "logResponse"], // Debug...
              },
              onError: {
                // target: "verifyingContracts",
                target: "ipfs", // TODO: the target should be "fundingContracts" maybe?...
                actions: ["assignErrorToContext", "onMerkleContractsError"],
              },
            },
            on: {
              SKIP: {
                target: "ipfs",
              },
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
          },
          creatingCohorts: {
            invoke: {
              src: "addCohorts",
              onDone: {
                target: "fundingContracts",
                actions: ["logResponse"], // Debug...
              },
              onError: {
                target: "fundingContracts",
                actions: ["assignErrorToContext", "onCreateCohortsError"],
              },
            },
            on: {
              SKIP: {
                target: "fundingContracts",
              },
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
          },
          fundingContracts: {
            invoke: {
              src: "fundContracts",
              onDone: {
                // target: "verifyingContracts",
                target: "ipfs",
                actions: ["logResponse"], // Debug
              },
              onError: {
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
              },
            },
            on: {
              SKIP: {
                // target: "verifyingContracts",
                target: "ipfs",
              },
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
          },
          verifyingContracts: {
            // TODO...
          },
          ipfs: {
            invoke: {
              src: "uploadToIpfs",
              onDone: {
                target: "finished",
                actions: ["logResponse"], // Debug...
              },
              onError: {
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
              },
            },
            on: {
              SKIP: {
                target: "finished",
              },
            },
          },
          finished: {
            type: "final",
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
          assignDataToContext: assign((_, event) => ({
            ...event.data,
          })),
          logResponse: (_context, event) =>
            process.env.NODE_ENV === "development"
              ? console.log("LOGRESPONSE", _context, event)
              : {},
          assignResponseToContext: assign((_context, event) => ({
            response: event?.data,
          })),
          onSuccess: () =>
            toast({
              status: "success",
              title: "Successful token issuance!",
            }),
          onError: (_context) =>
            toast({
              status: "error",
              title: "Uh-oh!",
              description: _context.error,
            }),
          onDisperseError: () =>
            toast({
              title: "Could not distribute tokens",
              description:
                "Do not worry, you'll be able to send these tokens later on your dashboard!",
            }),
          onMerkleContractsError: () =>
            toast({
              title: "Could not deploy airdrop/vesting contracts",
              description:
                "Do not worry, you'll be able to create airdrops and vestings later on your dashboard!",
            }),
          onCreateCohortsError: () =>
            toast({
              title: "Could not create cohorts",
              description:
                "Do not worry, you'll be able to add cohorts to your vesting contract later on your dashboard!",
            }),
        },
      }
    )
  )

  const [state, send] = useMachine(addAllocationsMachine.current, {
    services: {
      // TODO...
      setupInitialContext: async (_) => {
        // TODO: if we can't fetch the token address/deployer, then the machine should go to error state

        // Else, we should save these data to the context
        send("UPDATE_CONTEXT", {
          data: {
            tokenAddress,
            decimals: tokenDataFromContract?.decimals,
            deployer: tokenDataFromContract?.owner?.toLowerCase(),
            distributionData,
          },
        })
        return
      },
      sendTokensWithDisperse: async (_context) => {
        // If the user hasn't selected a "DISTRIBUTE" type for an allocation, we can skip this step
        const disperseDistribution = _context.distributionData?.find(
          (allocation) => allocation.vestingType === "DISTRIBUTE"
        )
        if (!disperseDistribution) return send("SKIP")

        return sendTokensWithDisperse(
          signerData,
          _context.tokenAddress,
          _context.decimals,
          distributionData
        )
      },
      createMerkleContracts: async (_context) => {},
      addCohorts: async (_context) => {},
      fundContracts: async (_context) => {},
      verifyContracts: async (_context) => {},
      uploadToIpfs: async (_context) => {},
    },
  })

  useWarnIfUnsavedChanges(!state?.matches("idle"))

  const startAddAllocations = () => send("START")

  const isLoading = useMemo(
    () =>
      !state.matches("idle") &&
      !state.matches("finished") &&
      !state.matches("error"),
    [state]
  )

  const loadingText = useMemo(() => {
    if (state.matches("sendingTokensWithDisperse")) return "Distributing tokens"
    else if (state.matches("creatingMerkleContracts")) return "Deploying contracts"
    else if (state.matches("creatingCohorts")) return "Creating cohorts"
    else if (state.matches("fundingContracts"))
      return "Funding airdrop/vesting contracts"
    else if (state.matches("verifyingContracts")) return "Verifying contracts"
    else if (state.matches("ipfs")) return "Uploading data to IPFS"
    else return "Loading"
  }, [state])

  const finished = useMemo(() => state.matches("finished"), [state])

  return { startAddAllocations, isLoading, loadingText, finished }
}

export default useAddAllocations
