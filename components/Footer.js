import React from "react"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import Link from "next/link"
import contractAddresses from "../lib/contractAddresses.json"

import { ImInfo } from "react-icons/im"

export default function Footer() {
    const [showInfo, setShowInfo] = useState(false)
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "0"

    const dexAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][0]
            : null
    const tokenAddress =
        chainId in contractAddresses
            ? contractAddresses[chainId]["DEX"][1]
            : null

    useEffect(() => {
        console.log(chainId)
        if (isWeb3Enabled && chainId != "5") {
            alert("Goerli testnet only!")
        }
        setShowInfo(false)
    }, [isWeb3Enabled, chainId])

    return (
        <div className="absolute bottom-0 w-screen">
            {showInfo ? (
                <div className=" z-10 absolute bottom-16 bg-gray-900 rounded-xl mx-2">
                    <div className="text-xs text-gray-100 p-2 sm:text-base">
                        <p>Goerli testnet only!</p>
                        <p>{`Token address: ${tokenAddress}`}</p>
                        <p>{`DEX address: ${dexAddress}`}</p>
                        <div className="flex">
                            <button
                                className="mx-auto bg-blue-800 mt-1 rounded-xl py-1 px-4 font-semibold cursor-pointer ease-in-out duration-150 hover:bg-blue-700"
                                onClick={() => setShowInfo(false)}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="py-1 px-4 border-t border-t-gray-700 flex justify-between items-center max-w-6xl m-auto flex-row">
                <ul className="flex justify-center items-center gap-4">
                    <li className="text-gray-400 text-sm" title="Swap">
                        <Link href="/">
                            <a className="font-semibold ease-in-out duration-150 hover:text-white">
                                Swap
                            </a>
                        </Link>
                    </li>

                    <li className="text-gray-400 text-sm" title="Pool">
                        <Link href="/pool">
                            <a className="font-semibold ease-in-out duration-150 hover:text-white">
                                Pool
                            </a>
                        </Link>
                    </li>

                    <li className="flex text-gray-400 text-sm" title="Info">
                        <button
                            className="my-auto ease-in-out duration-150 hover:text-white"
                            onClick={() => setShowInfo(true)}
                        >
                            <span>
                                <ImInfo />
                            </span>
                        </button>
                    </li>
                </ul>
                <div>
                    <div title="Goerli only" className="flex">
                        <div className="my-auto mx-2">
                            <div
                                className={`p-1 rounded ${
                                    chainId === "5"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            ></div>
                        </div>
                        <h5 className="text-gray-400 font-initial text-sm">
                            {`Network ${chainId}`}
                        </h5>
                    </div>
                </div>
            </div>
            <div className="py-2 pt-0 px-2">
                <h5 className="text-gray-400 text-xs text-center leading-6">
                    {"Made with "}
                    <a
                        href="https://nextjs.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-gray-300 hover:text-blue-400"
                    >
                        Next.js
                    </a>
                    {" & "}
                    <a
                        href="https://tailwindcss.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-gray-300 hover:text-blue-400"
                    >
                        TailwindCSS
                    </a>
                    {"."}
                </h5>
            </div>
        </div>
    )
}
