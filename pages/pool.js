import Pool from "../components/Pool.js"

import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import contractAddresses from "../lib/contractAddresses.json"
import dexAbi from "../lib/dexAbi.json"
import tokenAbi from "../lib/tokenAbi.json"

export default function PoolPage() {
    const [poolModal, setPoolModal] = useState(false)
    const [liquidity, setLiquidity] = useState({
        name: "default",
        total: "",
        account: "",
        new: "",
    })

    const { runContractFunction, isLoading } = useWeb3Contract()
    const dispacth = useNotification()
    const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "31337"

    console.log(account, isLoading)

    const dexAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][0]
            : null
    const tokenAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][1]
            : null

    /* Liquidity pool function */
    async function runDeposit() {
        const oneEth = ethers.utils.parseEther("1")

        const [ethBalance, tokenBalance] = await getDexBalances()
        const totalLiquidity = await getTotalLiquidity()
        const newLiquidity = oneEth.mul(totalLiquidity).div(ethBalance)
        const tokenAmount = newLiquidity.mul(tokenBalance).div(totalLiquidity)

        await approveToken(tokenAmount)
    }
    async function handleApproveSuccess(tx) {
        const txResponse = await tx.wait(1)
        const spenderAddress = txResponse.events[0].args.spender
        console.log(spenderAddress)
        const depositParams = {
            abi: dexAbi,
            contractAddress: dexAddress,
            functionName: "deposit",
            msgValue: ethers.utils.parseEther("1"),
            params: {},
        }

        const depositTx = await runContractFunction({
            params: depositParams,
            onSuccess: handleDepositSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleDepositSuccess(tx) {
        const txResponse = await tx.wait(1)
        const newTotal = txResponse.events[1].args.liquidityPool
        const msg = ethers.utils.formatUnits(newTotal.account, 36)
        dispacth({
            type: "success",
            id: "notification",
            message: `${msg} Total pool`,
            title: "Deposit",
            position: "bottomR",
        })
        updateLiquidity()
    }
    async function runWithdraw() {
        //const mockValue = ethers.utils.parseUnits(value, 36)
        console.log(liquidity.account.toString())
        if (liquidity.account > 0) {
            const withdrawParams = {
                abi: dexAbi,
                contractAddress: dexAddress,
                functionName: "withdraw",
                params: { liquidityAmount: liquidity.account },
            }

            const withdrawTx = await runContractFunction({
                params: withdrawParams,
                onSuccess: handleWithdrawSuccess,
                onError: (error) => {
                    console.log(error)
                },
            })
        } else {
            console.log("e 0blance")
        }
    }

    async function handleWithdrawSuccess(tx) {
        const txResponse = await tx.wait(1)
        const newTotal = txResponse.events[1].args.liquidityPool
        dispacth({
            type: "success",
            id: "notification",
            message: `${newTotal.toString()}`,
            title: "Withdraw",
            position: "bottomR",
        })

        updateLiquidity()
    }

    /* Token approve function */
    async function approveToken(value) {
        const approveTokenTx = await runContractFunction({
            params: {
                abi: tokenAbi,
                contractAddress: tokenAddress,
                functionName: "approve",
                params: {
                    spender: dexAddress,
                    amount: value,
                },
            },
            onSuccess: handleApproveSuccess,
            onError: (error) => {
                console.log(error)
                return false
            },
        })
    }

    /* View/Pure contract functions */

    async function getDexBalances() {
        if (!isWeb3Enabled) {
            return [
                ethers.utils.parseEther("1"),
                ethers.utils.parseEther("1000"),
            ]
        }
        const [ethBalance, tokenBalance] = await runContractFunction({
            params: {
                abi: dexAbi,
                contractAddress: dexAddress,
                functionName: "getContractBalances",
                params: {},
            },
            onSuccess: () => console.log("success: getContractBalances"),
            onError: (error) => {
                console.log(error)
            },
        })

        return [ethBalance, tokenBalance]
    }

    async function getTotalLiquidity() {
        const totalLiquidity = await runContractFunction({
            params: {
                abi: dexAbi,
                contractAddress: dexAddress,
                functionName: "getTotalLiquidity",
                params: {},
            },
            onSuccess: () => console.log("success: getTotalLiquidity"),
            onError: (error) => {
                console.log(error)
            },
        })
        return totalLiquidity
    }

    async function getAccountLiquidity(accountAddress) {
        const accountLiquiduty = await runContractFunction({
            params: {
                abi: dexAbi,
                contractAddress: dexAddress,
                functionName: "getAccountLiquidity",
                params: {
                    account: accountAddress,
                },
            },
            onSuccess: () => console.log("success: getAccountLiquidity"),
            onError: (error) => {
                console.log(error)
            },
        })
        return accountLiquiduty
    }

    /* UI update */
    async function updateLiquidity() {
        if (account && isWeb3Enabled) {
            const accountLiquiduty = await getAccountLiquidity(account)
            console.log(accountLiquiduty.toString())

            setLiquidity((prev) => {
                return { ...prev, account: accountLiquiduty }
            })
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateLiquidity()
        }
    }, [isWeb3Enabled, account])

    /* return */
    return (
        <div className="mx-auto">
            <Pool
                liquidity={liquidity}
                handleDepositClick={() => runDeposit()}
                handleWithdrawClick={() => runWithdraw()}
            />
        </div>
    )
}
