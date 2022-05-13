import { useMachine } from "@xstate/react"
import addCohorts from "components/token-issuance/DeployForm/utils/addCohorts"
import createMerkleContracts from "components/token-issuance/DeployForm/utils/createMerkleContracts"
import fundContracts from "components/token-issuance/DeployForm/utils/fundContracts"
import monthsToSeconds from "components/token-issuance/DeployForm/utils/monthsToSeconds"
import sendTokensWithDisperse from "components/token-issuance/DeployForm/utils/sendTokensWithDisperse"
import { Event } from "ethers"
import useAllocationData from "hooks/useAllocationData"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import useTokenDataFromContract from "hooks/useTokenDataFromContract"
import useTokenDeployedEvents from "hooks/useTokenDeployedEvents"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import {
  AllocationFormType,
  AllocationJSON,
  TokenInfoJSON,
  TokenIssuanceFormType,
} from "types"
import { MerkleDistributorInfo } from "utils/merkle/parseBalanceMap"
import slugify from "utils/slugify"
import { useAccount, useSigner } from "wagmi"
import { assign, createMachine } from "xstate"

const useAddAllocations = () => {
  const router = useRouter()
  const chain = router.query?.chain?.toString()
  const tokenAddress = router.query?.token?.toString()

  const [{ data: accountData }] = useAccount()

  const { data: tokenDataFromContract } = useTokenDataFromContract(tokenAddress)
  const { data: tokenData, mutate: mutateTokenData } = useTokenData()
  const { data: tokenDeployedEvents } = useTokenDeployedEvents("MY")

  const tokenUrlName = useMemo(
    () =>
      tokenDeployedEvents?.find(
        (event) => event.args?.[2]?.toLowerCase() === tokenAddress
      )?.args?.[1],
    [tokenDeployedEvents, tokenAddress]
  )

  const { data: vestingData } = useAllocationData(
    tokenData?.infoJSON?.vestings?.[0]?.fileName
      ? `${chain}/${tokenAddress}/${tokenData?.infoJSON?.vestings?.[0]?.fileName}`
      : null
  )

  const [{ data: signerData }] = useSigner()
  const tokenXyzContract = useTokenXyzContract()

  const { getValues } = useFormContext<TokenIssuanceFormType>()
  const distributionData = getValues("distributionData")

  const toast = useToast()

  const addAllocationsMachine = useRef(
    createMachine<{
      tokenDeployer?: string
      tokenUrlName?: string
      tokenAddress?: string
      decimals?: number
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
          // TODO: add a step where we check if the user has uploaded CSVs which they haven't used yet for other airdrops/vestings!!
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
                target: "idle",
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
          onSuccess: () => {
            mutateTokenData()
            toast({
              status: "success",
              title: "Successfully added allocations!",
            })
          },
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
      setupInitialContext: async (_) => {
        // TODO: if we can't fetch the token address/deployer, then the machine should go to error state

        // Else, we should save these data to the context
        send("UPDATE_CONTEXT", {
          data: {
            tokenAddress,
            tokenUrlName,
            decimals: tokenDataFromContract?.decimals,
            tokenDeployer: tokenDataFromContract?.owner?.toLowerCase(),
            merkleVestingContractAddress:
              vestingData?.merkleVesting?.contractAddress,
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

        return sendTokensWithDisperse({
          signerData,
          tokenData: {
            address: _context.tokenAddress,
            decimals: _context.decimals,
          },
          distributionData: _context.distributionData,
        })
      },
      createMerkleContracts: async (_context) =>
        createMerkleContracts(
          tokenXyzContract,
          {
            tokenData: {
              address: _context.tokenAddress,
              urlName: _context.tokenUrlName,
              deployer: _context.tokenDeployer,
            },
            distributionData: _context.distributionData,
            merkleVestingContractAddress: _context.merkleVestingContractAddress,
          },
          (dataToUpdate) => send("UPDATE_CONTEXT", dataToUpdate),
          () => send("SKIP")
        ),
      addCohorts: async (_context) => {
        const shouldCreateVesting = distributionData.some(
          (allocation) => allocation.vestingType === "LINEAR_VESTING"
        )

        /**
         * START Duplicate code, we have really similar lines in useDeploy too, maybe
         * we should do a refactor or something...
         */
        // If the user deployed MerkleDistributor contracts, save them to the context
        const merkleDistributorDeployedEvents: Array<Event> =
          _context?.response?.events?.filter(
            (event) => event.event === "MerkleDistributorDeployed"
          )
        if (merkleDistributorDeployedEvents?.length) {
          const merkleDistributorContractAddresses: Array<string> = []

          merkleDistributorDeployedEvents.forEach((event) => {
            const [, , merkleDistributorContractAddress] = event.args

            merkleDistributorContractAddresses.push(merkleDistributorContractAddress)
          })

          send("UPDATE_CONTEXT", {
            data: { merkleDistributorContractAddresses },
          })
        }

        // Check if the user deployed a MerkleVesting contract. If so, save its data to the context and prepare the `addCohort` calls.
        const merkleVestingDeployedEvent: Event = _context?.response?.events?.find(
          (event) => event.event === "MerkleVestingDeployed"
        )

        let localMerkleVestingContractAddress
        if (merkleVestingDeployedEvent) {
          const [, , merkleVestingContractAddress] = merkleVestingDeployedEvent.args
          localMerkleVestingContractAddress = merkleVestingContractAddress

          send("UPDATE_CONTEXT", { data: { merkleVestingContractAddress } })
        }

        if (!shouldCreateVesting) return send("SKIP")
        /** END */

        return addCohorts({
          signerData,
          distributionData: _context.distributionData,
          merkleTrees: _context.merkleTrees,
          merkleVestingContractAddress:
            _context.merkleVestingContractAddress ??
            localMerkleVestingContractAddress,
        })
      },
      fundContracts: async (_context) =>
        fundContracts(
          {
            tokenData: {
              address: _context.tokenAddress,
              decimals: _context.decimals,
            },
            signerData,
            distributionData: _context.distributionData,
            merkleDistributorContractAddresses:
              _context.merkleDistributorContractAddresses,
            merkleVestingContractAddress: _context.merkleVestingContractAddress,
          },
          send
        ),
      verifyContracts: async (_context) => {},
      uploadToIpfs: async (_context) => {
        const ipfsData = new FormData()
        ipfsData.append("dirName", `${chain}/${_context.tokenAddress}`)

        const info: TokenInfoJSON = { ...tokenData?.infoJSON }
        const defaultAirdopsIndex = info?.airdrops?.length ?? 0
        const defaultVestingsIndex = info?.vestings?.length ?? 0

        const allocationJSONs: Array<AllocationJSON> = []

        const currentDateInSeconds = Math.floor(Date.now() / 1000) + 60 // Adding 1 minute, because the deployment could take some time

        const airdrops = distributionData?.filter(
          (allocation) => allocation.vestingType === "NO_VESTING"
        )

        if (
          airdrops?.length &&
          _context.merkleDistributorContractAddresses?.length
        ) {
          airdrops.forEach((airdrop, index) => {
            const originalIndex = distributionData.findIndex(
              (allocation) =>
                allocation.allocationName.toLowerCase() ===
                airdrop.allocationName.toLowerCase()
            )

            const distributionDurationInSeconds = monthsToSeconds(
              airdrop.distributionDuration
            )
            const distributionEnd = Math.round(
              currentDateInSeconds + distributionDurationInSeconds
            )

            const allocationData: AllocationJSON = {
              vestingType: "NO_VESTING",
              name: airdrop.allocationName,
              createdBy: accountData?.address,
              createdAt: currentDateInSeconds,
              merkleDistribution: {
                contractAddress:
                  _context.merkleDistributorContractAddresses?.[index],
                distributionEnd,
                ..._context.merkleTrees?.[originalIndex],
              },
            }

            allocationJSONs.push(allocationData)
          })
        }

        const linearVestings = distributionData?.filter(
          (allocation) => allocation.vestingType === "LINEAR_VESTING"
        )

        if (linearVestings?.length && _context.merkleVestingContractAddress) {
          const allocationData: AllocationJSON = {
            vestingType: "LINEAR_VESTING",
            name: "Vesting",
            createdBy: accountData?.address,
            createdAt: currentDateInSeconds,
            merkleVesting: {
              contractAddress: _context.merkleVestingContractAddress,
              cohorts: [],
            },
          }

          // Populating the "cohorts" field
          linearVestings.forEach((vesting) => {
            const originalIndex = distributionData.findIndex(
              (allocation) =>
                allocation.allocationName.toLowerCase() ===
                vesting.allocationName.toLowerCase()
            )

            const distributionDurationInSeconds = monthsToSeconds(
              vesting.distributionDuration
            )
            const cliffPeriod = monthsToSeconds(vesting.cliff)
            const vestingPeriod = monthsToSeconds(vesting.vestingPeriod)
            const distributionEnd = Math.round(
              currentDateInSeconds + distributionDurationInSeconds
            )

            allocationData.merkleVesting.cohorts.push({
              name: vesting.allocationName,
              cliffPeriod,
              vestingPeriod,
              distributionEnd,
              ..._context.merkleTrees?.[originalIndex],
            })
          })

          allocationJSONs.push(allocationData)
        }

        for (const [index, json] of (allocationJSONs ?? []).entries()) {
          const updatedIndex = defaultAirdopsIndex + defaultVestingsIndex + index

          // If there's already a LINEAR_VESTING type allocation JSON, we just need to update that one
          if (json.vestingType === "LINEAR_VESTING" && defaultVestingsIndex > 0) {
            const fileName = info.vestings[0].fileName
            const fileContent = await fetch(
              `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${tokenAddress}/${fileName}`
            )
              .then((res) => res.json())
              .catch((_) => undefined)
            console.log("FILE CONTENT BEFORE UPDATE", fileContent)

            if (fileContent) {
              const newFileContent = { ...fileContent }

              json.merkleVesting.cohorts.forEach((cohort) =>
                newFileContent.merkleVesting.cohorts.push(cohort)
              )
            }

            console.log("FILE CONTENT AFTER UPDATE", fileContent)
            ipfsData.append(fileName, JSON.stringify(fileContent))
          } else {
            const fileName = `allocation${updatedIndex}.json`
            ipfsData.append(fileName, JSON.stringify(json))

            const metadataAttribute =
              json.vestingType === "NO_VESTING"
                ? "airdrops"
                : json.vestingType === "LINEAR_VESTING"
                ? "vestings"
                : null

            if (metadataAttribute) {
              if (!info[metadataAttribute]) info[metadataAttribute] = []

              info[metadataAttribute].push({
                fileName,
                prettyUrl: slugify(json.name),
              })
            }
          }
        }

        console.log("Info after modification", info)

        ipfsData.append("info.json", JSON.stringify(info))
        return fetch("/api/upload-to-ipfs", { method: "POST", body: ipfsData })
      },
    },
  })

  useWarnIfUnsavedChanges(!state?.matches("idle") || !state.matches("finished"))

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
