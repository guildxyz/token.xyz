import { useMachine } from "@xstate/react"
import { ethers, utils } from "ethers"
import useToast from "hooks/useToast"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import { useEffect, useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import MerkleVestingABI from "static/abis/MerkleVestingABI.json"
import {
  AllocationFormType,
  AllocationJSON,
  TokenInfoJSON,
  TokenIssuanceFormType,
} from "types"
import generateMerkleTree from "utils/merkle/generateMerkleTree"
import { MerkleDistributorInfo, parseBalanceMap } from "utils/merkle/parseBalanceMap"
import slugify from "utils/slugify"
import { erc20ABI, useAccount, useSigner } from "wagmi"
import { assign, createMachine } from "xstate"

const monthsToSecond = (months: number): number =>
  months ? Math.floor(months * 2629743.83) : 0

const useDeploy = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const tokenXyzContract = useTokenXyzContract()

  const { getValues } = useFormContext<TokenIssuanceFormType>()

  const [
    urlName,
    tokenName,
    tokenTicker,
    icon,
    decimals,
    initialSupply,
    maxSupply,
    transferOwnershipTo,
    distributionData,
  ] = getValues([
    "urlName",
    "tokenName",
    "tokenTicker",
    "icon",
    "decimals",
    "initialSupply",
    "maxSupply",
    "transferOwnershipTo",
    "distributionData",
  ])

  const toast = useToast()

  const deployMachine = useRef(
    createMachine<{
      error?: string
      response?: Record<string, any>
      tokenDeployer?: string
      tokenUrlName?: string
      tokenAddress?: string
      merkleVestingContractAddress?: string
      merkleDistributorContractAddress?: string
      merkleTrees?: Array<MerkleDistributorInfo>
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
                target: "creatingMerkleContracts",
                actions: ["assignResponseToContext", "logResponse"], // Debug
              },
              onError: {
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
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
                actions: ["assignErrorToContext", "onError"],
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
                target: "idle",
                actions: ["assignErrorToContext", "onError"],
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
                target: "ipfs",
              },
              UPDATE_CONTEXT: {
                actions: ["assignDataToContext"],
              },
            },
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
          assignDataToContext: assign((_context, event) => ({
            ...event.data,
          })),
          logResponse: (_context, event) =>
            process.env.NODE_ENV === "development"
              ? console.log("LOGRESPONSE", _context, event)
              : {},
          assignResponseToContext: assign((_context, event) => ({
            response: event?.data,
          })),
          onSuccess: (_context) =>
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
            utils.parseEther(initialSupply?.toString()).toString(),
            maxSupply ? utils.parseEther(maxSupply.toString()).toString() : null,
            transferOwnershipTo || accountData?.address
          )
          .then((res) => res.wait()),
      createMerkleContracts: async (_context) => {
        const tokenDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "TokenDeployed"
        )

        const [tokenDeployer, tokenUrlName, tokenAddress] = tokenDeployedEvent.args

        // Assinging the data to the context, so we can use these in the upcoming machine states
        send("UPDATE_CONTEXT", {
          data: {
            tokenDeployer,
            tokenUrlName,
            tokenAddress: tokenAddress?.toLowerCase(),
          },
        })

        // If there's no distribution data, we can skip this step
        if (!distributionData?.length) return send("SKIP")

        // Generating and storing merkle trees, so we don't need to regenerate them where we need to use them
        const merkleTrees = distributionData.map((allocation) =>
          parseBalanceMap(generateMerkleTree(allocation.allocationAddressesAmounts))
        )

        send("UPDATE_CONTEXT", { data: { merkleTrees } })

        // Preparing the contract calls
        const contractCalls = []

        // Deploying 1 vesting contract if needed
        const shouldCreateVesting = distributionData.some(
          (allocation) => allocation.vestingType === "LINEAR_VESTING"
        )

        if (shouldCreateVesting)
          contractCalls.push(
            tokenXyzContract.interface.encodeFunctionData(
              "createVesting(string,address,address)",
              [tokenUrlName, tokenAddress, tokenDeployer]
            )
          )

        // Preparing the "createAirdrop" call(s)
        distributionData?.forEach((allocation, index) => {
          if (allocation.vestingType !== "NO_VESTING") return

          // Distribution duration in seconds
          const distributionDuration = monthsToSecond(
            allocation.distributionDuration
          )

          contractCalls.push(
            tokenXyzContract.interface.encodeFunctionData(
              "createAirdrop(string,address,bytes32,uint256,address)",
              [
                tokenUrlName,
                tokenAddress,
                merkleTrees?.[index]?.merkleRoot,
                distributionDuration,
                tokenDeployer,
              ]
            )
          )
        })

        return tokenXyzContract
          .multicall(contractCalls)
          .then((multicallRes) => multicallRes?.wait())
      },
      addCohorts: async (_context) => {
        const shouldCreateVesting = distributionData.some(
          (allocation) => allocation.vestingType === "LINEAR_VESTING"
        )

        // If the user deployed a MerkleDistributor contract, save it to the context
        const merkleDistributorDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "MerkleDistributorDeployed"
        )
        if (merkleDistributorDeployedEvent) {
          const [, , merkleDistributorContractAddress] =
            merkleDistributorDeployedEvent.args
          send("UPDATE_CONTEXT", { data: { merkleDistributorContractAddress } })
        }

        // Check if the user deployed a MerkleVesting contract. If so, save its data to the context and prepare the `addCohort` calls.
        const merkleVestingDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "MerkleVestingDeployed"
        )

        if (!shouldCreateVesting || !merkleVestingDeployedEvent) return send("SKIP")

        const [, , merkleVestingContractAddress] = merkleVestingDeployedEvent.args

        send("UPDATE_CONTEXT", { data: { merkleVestingContractAddress } })

        const merkleVestingContract = new ethers.Contract(
          merkleVestingContractAddress,
          MerkleVestingABI,
          signerData
        )

        const addCohortCalls = []

        // Preparing the "addCohort" calls
        distributionData?.forEach((allocation, index) => {
          if (allocation.vestingType !== "LINEAR_VESTING") return

          // Distribution duration in seconds
          const distributionDuration = monthsToSecond(
            allocation.distributionDuration
          )

          const cliff = monthsToSecond(allocation.cliff)
          const vestingPeriod = monthsToSecond(allocation.vestingPeriod)

          addCohortCalls.push(
            merkleVestingContract.interface.encodeFunctionData(
              "addCohort(bytes32,uint256,uint64,uint64)",
              [
                _context.merkleTrees?.[index]?.merkleRoot,
                distributionDuration,
                vestingPeriod,
                cliff,
              ]
            )
          )
        })

        return merkleVestingContract
          .multicall(addCohortCalls)
          .then((addCohortCallsRes) => addCohortCallsRes?.wait())
      },
      fundContracts: async (_context) => {
        // Converter function which returns the amount of tokens needed to be sent to each vesting/distributor contract
        const converter = (input: Array<AllocationFormType>): number => {
          if (!input) return 0
          return input
            .map((allocation) => allocation.allocationAddressesAmounts)
            ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
            ?.filter((item) => !!item)
            ?.map((data) => parseInt(data.amount))
            ?.reduce((amount1, amount2) => amount1 + amount2, 0)
        }

        const airdropAmount = converter(
          distributionData?.filter(
            (allocation) => allocation.vestingType === "NO_VESTING"
          )
        )
        const vestingAmount = converter(
          distributionData?.filter(
            (allocation) => allocation.vestingType === "LINEAR_VESTING"
          )
        )

        if (process.env.NODE_ENV === "development")
          console.log(`Airdrop funding amount: ${airdropAmount}`)
        if (process.env.NODE_ENV === "development")
          console.log(`Vesting funding amount: ${vestingAmount}`)
        // This should not happen, but in case something goes wrong, we can skip this step (and maybe fund the contracts manually later)
        if (!airdropAmount && !vestingAmount) return send("SKIP")

        const deployedTokenContract = new ethers.Contract(
          _context.tokenAddress,
          erc20ABI,
          signerData
        )

        const transfers = []

        if (_context.merkleDistributorContractAddress && airdropAmount) {
          transfers.push(
            deployedTokenContract
              ?.transfer(
                _context.merkleDistributorContractAddress,
                ethers.utils.parseUnits(airdropAmount.toString(), 18)
              )
              .then((res) => res.wait())
          )
        }

        if (_context.merkleVestingContractAddress && vestingAmount) {
          transfers.push(
            deployedTokenContract
              ?.transfer(
                _context.merkleVestingContractAddress,
                ethers.utils.parseUnits(vestingAmount.toString(), 18)
              )
              .then((res) => res.wait())
          )
        }

        return Promise.all(transfers)
      },
      uploadToIpfs: async (_context) => {
        console.log(
          `DEPLOYED CONTRACTS:\n--------------------\nToken: ${_context.tokenAddress}\nMerkleDistributor: ${_context.merkleDistributorContractAddress}\nMerkleVesting:${_context.merkleVestingContractAddress}\n----------`
        )

        if (!icon && !distributionData?.length) return send("SKIP")

        const ipfsData = new FormData()
        ipfsData.append("dirName", _context.tokenAddress)

        const info: TokenInfoJSON = {
          icon: null,
          airdrops: [],
          vestings: [],
        }

        distributionData.forEach((allocation, index) => {
          const currentDateInSeconds = Date.now() / 1000
          const distributionDurationInSeconds = monthsToSecond(
            allocation.distributionDuration
          )
          const cliffInSeconds = monthsToSecond(allocation.cliff)
          const vestingPeriodInSeconds = monthsToSecond(allocation.vestingPeriod)

          const merkleData: AllocationJSON = {
            ..._context.merkleTrees?.[index],
            vestingType: allocation.vestingType,
            distributionEnd: Math.round(
              currentDateInSeconds + distributionDurationInSeconds
            ),
            vestingEnd: Math.round(currentDateInSeconds + vestingPeriodInSeconds),
            vestingPeriod: vestingPeriodInSeconds,
            cliffPeriod: cliffInSeconds,
            createdBy: accountData?.address,
            tokenAddress: _context.tokenAddress,
            vestingContract: _context.merkleVestingContractAddress,
            name: allocation.allocationName,
          }

          if (allocation.vestingType === "NO_VESTING") {
            merkleData.merkleDistributorContract =
              _context?.merkleDistributorContractAddress
          }

          ipfsData.append(`allocation${index}.json`, JSON.stringify(merkleData))

          const metadataAttribute =
            allocation.vestingType === "NO_VESTING" ? "airdrops" : "vestings"
          info[metadataAttribute].push({
            fileName: `allocation${index}.json`,
            prettyUrl: slugify(allocation.allocationName),
          })
        })

        if (icon) {
          ipfsData.append("icon", icon, `icon.${icon.name.split(".").pop()}`)
          info.icon = `icon.${icon.name.split(".").pop()}`
        }

        ipfsData.append("info.json", JSON.stringify(info))

        return fetch("/api/upload-to-ipfs", { method: "POST", body: ipfsData })
      },
    },
  })

  // DEBUG
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log("MACHINE STATE", state)
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
    else if (state.matches("creatingMerkleContracts")) return "Deploying contracts"
    else if (state.matches("creatingCohorts")) return "Creating cohorts"
    else if (state.matches("fundingContracts"))
      return "Funding airdrop/vesting contracts"
    else if (state.matches("ipfs")) return "Uploading data to IPFS"
    else return "Loading"
  }, [state])

  const finished = useMemo(() => state.matches("finished"), [state])

  return { startDeploy, isLoading, loadingText, finished }
}

export default useDeploy
