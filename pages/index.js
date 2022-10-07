import Swap from "../components/Swap.js"

import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import contractAddresses from "../lib/contractAddresses.json"
import dexAbi from "../lib/dexAbi.json"
import tokenAbi from "../lib/tokenAbi.json"
import { getAmountOut, getAmountIn } from "../lib/getAmount.js"
import { assets } from "../lib/data.js"

export default function Home() {
    const [swap, setSwap] = useState({
        first: assets[0] || "",
        second: assets[1] || "",
        isReversed: false,
    })

    const { runContractFunction } = useWeb3Contract()
    const dispacth = useNotification()
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "31337"

    const dexAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][0]
            : null
    const tokenAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][1]
            : null

    /* Swap functions */
    async function setNewValues(event) {
        let { value, name } = event.target
        //event.preventDefault()
        value = value === "" ? "0" : value

        const [xReserve, yReserve] = await getDexBalances(swap.isReversed)
        let firstVal, secondVal
        name === "firstVal"
            ? ((firstVal = value),
              (secondVal = getAmountOut(value, xReserve, yReserve)))
            : ((secondVal = value),
              (firstVal = getAmountIn(value, yReserve, xReserve)))

        setSwap((prevObj) => {
            return {
                ...prevObj,
                first: { ...prevObj.first, value: firstVal },
                second: { ...prevObj.second, value: secondVal },
            }
        })
    }

    async function handleSwap() {
        const isApproved = swap.isReversed
            ? await approveToken(swap.first.value)
            : true
        if (isApproved) {
            const swapParams = swap.isReversed
                ? {
                      abi: dexAbi,
                      contractAddress: dexAddress,
                      functionName: "tokenToEth",
                      //msgValue: ,
                      params: {
                          tokenAmount: ethers.utils.parseEther(
                              swap.first.value
                          ),
                      },
                  }
                : {
                      abi: dexAbi,
                      contractAddress: dexAddress,
                      functionName: "ethToToken",
                      msgValue: ethers.utils.parseEther(swap.first.value),
                      params: {},
                  }

            const buyTx = await runContractFunction({
                params: swapParams,
                onSuccess: handleSwapSuccess,
                onError: (error) => {
                    console.log(error)
                },
            })
        } else {
            //dispacth({})
        }
    }

    async function handleSwapSuccess(tx) {
        const txResponse = await tx.wait(1)
        console.log(txResponse)
        const [, input, output, asset] = txResponse.events[2].args
        const valueSold = ethers.utils.formatUnits(input, 18)
        const valueBought = ethers.utils.formatUnits(output, 18)
        dispacth({
            type: "success",
            id: "notification",
            message: `swapped ${valueSold} ${asset} ${valueBought}`,
            title: "Swap",
            position: "bottomR",
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
                    amount: ethers.utils.parseEther(value),
                },
            },
            onSuccess: () => {
                console.log("success: approved")
                return true
            },
            onError: (error) => {
                console.log(error)
                return false
            },
        })
        await approveTokenTx.wait(1)
        return approveTokenTx
    }

    /* View/Pure contract functions */
    async function getDexBalances(isReversed) {
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

        if (isReversed) {
            return [tokenBalance, ethBalance]
        } else {
            return [ethBalance, tokenBalance]
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            const mockEvent = {
                target: { name: "firstVal", value: swap.first.value },
            }
            setNewValues(mockEvent)
        }
    }, [isWeb3Enabled, swap.isReversed])

    return (
        <div className="mx-auto">
            <Swap
                swap={swap}
                handleChange={setNewValues}
                handleBuyClick={handleSwap}
                handleReverse={reverseSwap}
                isWeb3Enabled={isWeb3Enabled}
            />
        </div>
    )
}
