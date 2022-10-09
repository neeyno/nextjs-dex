import Pool from "../components/Pool.js"

import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import contractAddresses from "../lib/contractAddresses.json"
import dexAbi from "../lib/dexAbi.json"
import tokenAbi from "../lib/tokenAbi.json"
import { getDepositValue } from "../lib/helper-functions.js"

export default function PoolPage() {
    const [depositModal, setDepositModal] = useState(false)
    const [liquidity, setLiquidity] = useState({
        name: "default",
        total: "",
        account: "",
        withdraw: "",
        slider: "0",
        deposit: "",
        token: "",
    })

    const { runContractFunction, isLoading } = useWeb3Contract()
    const dispacth = useNotification()
    const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "31337"

    const dexAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][0]
            : null
    const tokenAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][1]
            : null

    /* Liquidity pool function */

    function setWithdrawInput(event) {
        let { value } = event.target
        value = value === "" ? 0 : value

        const withdrawVal = liquidity.account.mul(parseInt(value)).div(100) || 0

        setLiquidity((prevObj) => {
            return {
                ...prevObj,
                withdraw: withdrawVal,
                slider: value,
            }
        })
    }

    async function setDepositInput(event) {
        let { value } = event.target
        value = value === "" ? "0" : value

        // const depositEthValue = ethers.utils.parseEther(value)
        const [ethBalance, tokenBalance] = await getDexBalances()
        const totalLiquidity = await getTotalLiquidity()
        // const newLiquidity = depositEthValue.mul(totalLiquidity).div(ethBalance)
        // tokenAmount = newLiquidity.mul(tokenBalance).div(totalLiquidity)
        const [depositEthVal, depositTokenVal] = getDepositValue(
            value,
            ethBalance,
            tokenBalance,
            totalLiquidity
        )

        setLiquidity((prevObj) => {
            return {
                ...prevObj,
                deposit: depositEthVal,
                token: depositTokenVal,
            }
        })
    }

    // Deposit
    async function runDeposit() {
        if (liquidity.token) {
            await approveToken(liquidity.token)
        }
    }
    /* Token approve function */
    async function approveToken(value) {
        const tokenAmount = ethers.utils.parseEther(value)
        const approveTokenTx = await runContractFunction({
            params: {
                abi: tokenAbi,
                contractAddress: tokenAddress,
                functionName: "approve",
                params: {
                    spender: dexAddress,
                    amount: tokenAmount,
                },
            },
            onSuccess: handleApproveSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }
    async function handleApproveSuccess(tx) {
        const txResponse = await tx.wait(1)
        console.log(txResponse)
        const ethValue = ethers.utils.parseEther(liquidity.deposit)
        const depositParams = {
            abi: dexAbi,
            contractAddress: dexAddress,
            functionName: "deposit",
            msgValue: ethValue,
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
        const eventsNum = txResponse.events.length - 1
        const [, ethValue, tokenValue] = txResponse.events[eventsNum].args
        const ethDeposit = ethers.utils.formatUnits(ethValue, 18)
        const tokenDeposit = ethers.utils.formatUnits(tokenValue, 18)
        dispacth({
            type: "success",
            id: "notification",
            message: `${ethDeposit} Eth, ${tokenDeposit} tokens`,
            title: "Deposit!",
            position: "bottomR",
        })
        updateLiquidity()
    }

    // Withdraw
    async function runWithdraw() {
        //const withdrawAmount = ethers.utils.parseUnits("100", 36)
        if (liquidity.account > 0 && liquidity.account <= liquidity.withdraw) {
            const withdrawParams = {
                abi: dexAbi,
                contractAddress: dexAddress,
                functionName: "withdraw",
                params: { liquidityAmount: liquidity.withdraw },
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
        const eventsNum = txResponse.events.length - 1
        const [, ethValue, tokenValue] = txResponse.events[eventsNum].args
        const ethWithdrawn = ethers.utils.formatUnits(ethValue, 18)
        const tokenWithdrawn = ethers.utils.formatUnits(tokenValue, 18)
        dispacth({
            type: "success",
            id: "notification",
            message: `${ethWithdrawn} Eth, ${tokenWithdrawn}tokens`,
            title: "Withdraw",
            position: "bottomR",
        })

        updateLiquidity()
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
            setLiquidity((prev) => {
                return { ...prev, account: accountLiquiduty, slider: "0" }
            })
            setDepositModal(false)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateLiquidity()
        }
    }, [isWeb3Enabled, account])

    /* RETURN */
    return (
        <div className="mx-auto">
            <Pool
                liquidity={liquidity}
                isWeb3Enabled={isWeb3Enabled}
                handleDepositClick={() => runDeposit()}
                handleWithdrawClick={() => runWithdraw()} //() => setWithdrawalModal(true)}
                handleWithdrawChange={setWithdrawInput}
                handleDepositChange={setDepositInput}
                depositModal={depositModal}
                setDepositModal={setDepositModal}
            />
        </div>
    )
}
