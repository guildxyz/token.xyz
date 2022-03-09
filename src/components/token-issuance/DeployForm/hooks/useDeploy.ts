import { useMachine } from "@xstate/react"
import { ethers, utils } from "ethers"
import useToast from "hooks/useToast"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import { useMemo, useRef } from "react"
import { useFormContext } from "react-hook-form"
import MerkleVestingABI from "static/abis/MerkleVestingABI.json"
import { TokenIssuanceFormType } from "types"
import generateMerkleTree from "utils/merkle/generateMerkleTree"
import { MerkleDistributorInfo, parseBalanceMap } from "utils/merkle/parseBalanceMap"
import { useAccount, useSigner } from "wagmi"
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
    mintable,
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
    "mintable",
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
      merkleTrees?: Array<MerkleDistributorInfo>
      addCohortCalls?: Array<any> // TODO: better types!
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
                actions: ["assignResponseToContext", "logResponse"],
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
                target: "ipfs",
                actions: ["logResponse"], // Debug...
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
          onError: (_context, event) =>
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
            transferOwnershipTo || accountData?.address,
            mintable
          )
          .then((res) => res.wait()),
      createMerkleContracts: async (_context) => {
        const tokenDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "TokenDeployed"
        )

        // TODO: Maybe we don't event need this here, since if the deployment was successful, we should know the token data already...
        if (!tokenDeployedEvent) Promise.reject("Could not deploy token contract.")

        const [tokenDeployer, tokenUrlName, tokenAddress] = tokenDeployedEvent.args

        // Assinging the data to the context, so we can use these in the upcoming machine states
        send("UPDATE_CONTEXT", {
          data: { tokenDeployer, tokenUrlName, tokenAddress },
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

        const merkleVestingDeployedEvent = _context?.response?.events?.find(
          (event) => event.event === "MerkleVestingDeployed"
        )

        if (!shouldCreateVesting || !merkleVestingDeployedEvent) return send("SKIP")

        const [, , merkleVestingContractAddress] = merkleVestingDeployedEvent.args

        const merkleVestingContract = new ethers.Contract(
          merkleVestingContractAddress,
          MerkleVestingABI.abi,
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
      uploadToIpfs: async (_context) => {
        if (!icon && !distributionData?.length) return send("SKIP")

        const ipfsData = new FormData()

        ipfsData.append(
          "metadata",
          JSON.stringify({
            name: _context.tokenAddress,
          })
        )

        distributionData.forEach((allocation, index) => {
          const currentDateInSeconds = Date.now() / 1000
          const distributionDurationInSeconds = monthsToSecond(
            allocation.distributionDuration
          )
          const cliffInSeconds = monthsToSecond(allocation.cliff)
          const vestingPeriodInSeconds = monthsToSecond(allocation.vestingPeriod)

          const merkleData = {
            ..._context.merkleTrees?.[index],
            vestingType: allocation.vestingType,
            distributionEnd: Math.round(
              currentDateInSeconds + distributionDurationInSeconds
            ),
            vestingEnd: Math.round(currentDateInSeconds + vestingPeriodInSeconds),
            vestingPeriod: vestingPeriodInSeconds,
            cliffPeriod: cliffInSeconds,
            createdBy: accountData?.address,
          }

          ipfsData.append(
            "file",
            new Blob([JSON.stringify(merkleData)]),
            `${_context.tokenAddress}/allocation${index}.json`
          )
          if (process.env.NODE_ENV === "development")
            console.log(`[FILE]: allocation${index}.json`)
        })

        if (icon) {
          ipfsData.append(
            "file",
            icon,
            `${_context.tokenAddress}/icon.${icon.name.split(".").pop()}`
          )
        }

        const apiKey = await fetch("/api/pinata-key").then((response) =>
          response.json().then((body) => ({ jwt: body.jwt, key: body.key }))
        )

        await fetch(`${process.env.NEXT_PUBLIC_PINATA_API}/pinning/pinFileToIPFS`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey.jwt}`,
          },
          body: ipfsData,
        })
        // .then((res) => res?.json())

        await fetch("/api/pinata-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: apiKey.key }),
        }).catch(() => console.error("Failed to revoke API key after request"))
      },
    },
  })

  // DEBUG
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") console.log("MACHINE STATE", state)
  // }, [state])

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
    else if (state.matches("ipfs")) return "Uploading data to IPFS"
    else return "Loading"
  }, [state])

  const finished = useMemo(() => state.matches("finished"), [state])

  return { startDeploy, isLoading, loadingText, finished }
}

export default useDeploy
