import Swap from "../components/Swap.js"
import styles from "../styles/Home.module.css"

import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import contractAddresses from "../lib/contractAddresses.json"
import dexAbi from "../lib/dexAbi.json"
import tokenAbi from "../lib/tokenAbi.json"
import { getAmountOut, getAmountIn } from "../lib/getAmount.js"
import { assets } from "../lib/data.js"

export default function Home() {
    // const [first, second] = getAssets {first: {name: "Ethereum", symbol: "Eth", val: "", contractAddress} , second: {}}
    const [swap, setSwap] = useState({
        first: assets[0],
        second: assets[1],
        isReversed: false,
    })

    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "4"

    const dexAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][0]
            : null

    const tokenAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][1]
            : null

    const { runContractFunction } = useWeb3Contract()
    const dispacth = useNotification()

    async function getValues(event) {
        let { value, name } = event.target

        event.preventDefault()
        value = value === "" ? "0" : value

        const dexBalancesParams = {
            abi: dexAbi,
            contractAddress: dexAddress,
            functionName: "getContractBalances",
            params: {},
        }
        const [ethBalance, tokenBalance] = await runContractFunction({
            params: dexBalancesParams,
            onSuccess: () => console.log("success: getContractBalances"),
            onError: (error) => {
                console.log(error)
            },
        })

        let firstVal, secondVal, xReserve, yReserve
        if (!swap.isReversed) {
            xReserve = ethBalance
            yReserve = tokenBalance
        } else {
            xReserve = tokenBalance
            yReserve = ethBalance
        }
        name === "firstVal"
            ? ((firstVal = value),
              (secondVal = getAmountOut(value, xReserve, yReserve)))
            : ((secondVal = value),
              (firstVal = getAmountIn(value, yReserve, xReserve)))
        console.log(firstVal, secondVal)

        setSwap((prevObj) => {
            return {
                ...prevObj,
                first: { ...prevObj.first, value: firstVal },
                second: { ...prevObj.second, value: secondVal },
            }
        })
    }

    async function handleBuy() {
        console.log(swap.firstVal, swap.secondVal, swap.isReversed)

        const ethToTokenParams = {
            abi: dexAbi,
            contractAddress: dexAddress,
            functionName: "ethToToken",
            msgValue: ethers.utils.parseEther(swap.firstVal),
            params: {},
        }
        const tokenToEthParams = {
            abi: dexAbi,
            contractAddress: dexAddress,
            functionName: "tokenToEth",
            //msgValue: ,
            params: { tokenAmount: ethers.utils.parseEther(swap.firstVal) },
        }
        if (swap.isReversed) {
            const approveTokenTx = await runContractFunction({
                params: {
                    abi: tokenAbi,
                    contractAddress: tokenAddress,
                    functionName: "approve",
                    params: {
                        spender: dexAddress,
                        amount: ethers.utils.parseEther(swap.firstVal),
                    },
                },
                onSuccess: () => console.log("success: approve"),
                onError: (error) => {
                    console.log(error)
                },
            })
        }
        const buyTx = await runContractFunction({
            params: swap.isReversed ? tokenToEthParams : ethToTokenParams,
            onSuccess: () => console.log("success: swap"),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    function reverseSwap() {
        setSwap((prevObj) => {
            return {
                ...prevObj,
                first: prevObj.second,
                second: prevObj.first,
                isReversed: !prevObj.isReversed,
            }
        })

        console.log("changed")
    }

    return (
        <div className="mx-auto">
            <Swap
                swap={swap}
                handleChange={getValues}
                handleBuyClick={handleBuy}
                handleReverse={reverseSwap}
                isWeb3Enabled={isWeb3Enabled}
            />
            <p>{chainId}</p>
        </div>
    )
}
