import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

import styles from "../styles/Swap.module.css"

export default function Pool({}) {
    // const [addModal, setAddModal] = useState(1||"0")
    //const [liquidity, setLiquidity] = useState(1 || "0")
    //const [totalLiquidity, setTotalLiquidity] = useState(1 || "0")
    let valueToUpdate = 0

    function handleChange(event) {
        const { value } = event.target
        setPrice(() =>
            ethers.utils.parseEther(value && value.length < 20 ? value : "0")
        )
    }

    function runAddPool() {}

    return (
        <div className="w-screen flex items-center justify-center mt-16 px-1">
            <div className="bg-gray-900 text-gray-100 w-[40rem] rounded-2xl p-2 sm:w-[40rem] sm:p-4">
                <div className="px-2 flex items-center justify-between font-semibold text-xl ">
                    <div>Pool</div>
                    <button>add liquidity</button>
                </div>
                <div className="my-2 mx-auto rounded-2xl p-4 text-xl border border-gray-700 hover:border-gray-500 sm:text-2xl">
                    <div className="flex justify-between">
                        <input
                            id="input1"
                            className="bg-transparent placeholder:text-gray-500 text-center outline-none my-4 py-2 w-full border-b   border-gray-700 focus:border-blue-500"
                            type="number"
                            min="0"
                            step="0.1"
                            name="firstVal"
                            value="0"
                            placeholder={`0.00 `}
                            onChange={(e) => console.log(e)}
                        />
                        <label className="my-auto ml-4 w-1/4">Pool</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
