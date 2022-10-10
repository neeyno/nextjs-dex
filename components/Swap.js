import { WalletModal } from "web3uikit"
import { useState, useEffect } from "react"

import { FiRefreshCcw } from "react-icons/fi"

export default function Swap({
    swap,
    handleChange,
    handleBuyClick,
    handleReverse,
    isWeb3Enabled,
}) {
    const [walletModal, setWalletModal] = useState(false)

    useEffect(() => {
        if (isWeb3Enabled) {
            setWalletModal(false)
        }
    }, [isWeb3Enabled])

    return (
        <div className="w-screen flex items-center justify-center mt-16 px-1">
            <div className="z-20 bg-gray-900 text-gray-100 w-[40rem] rounded-2xl p-2 sm:w-[40rem] sm:p-4">
                <div className="px-2 flex items-center justify-between font-semibold text-xl ">
                    <div>Swap</div>
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
                            value={swap.first.value}
                            placeholder={`0.00 ${swap.first.symbol}`}
                            onChange={(e) => handleChange(e)}
                        />
                        <label className="my-auto ml-4 w-1/4">
                            {swap.first.name}
                        </label>
                    </div>

                    <button
                        className="flex p-2 mx-auto my-2 rounded-2xl ease-in-out duration-150 hover:text-blue-500"
                        onClick={() => handleReverse()}
                    >
                        <span className="text-3xl ">
                            <FiRefreshCcw />
                        </span>
                    </button>

                    <div className="flex justify-between">
                        <input
                            id="input2"
                            className="bg-transparent placeholder:text-gray-500 text-center outline-none my-4 py-2 w-full border-b border-gray-700 focus:border-blue-500"
                            type="number"
                            min="0"
                            step="0.1"
                            name="secondVal"
                            placeholder={`0.00 ${swap.second.symbol}`}
                            value={swap.second.value}
                            onChange={(e) => handleChange(e)}
                        />
                        <label className=" my-auto ml-4 w-1/4">
                            {swap.second.name}
                        </label>
                    </div>
                </div>
                <button
                    className="flex bg-blue-800 mt-4 mx-auto rounded-2xl py-2 px-12 text-xl font-semibold cursor-pointer ease-in-out duration-150 hover:bg-blue-700"
                    onClick={() => {
                        isWeb3Enabled ? handleBuyClick() : setWalletModal(true)
                    }}
                >
                    {isWeb3Enabled ? "Confirm swap" : "Connect Wallet"}
                </button>

                {/* {walletModal ? <WalletModal /> : null} */}
                <WalletModal
                    isOpened={walletModal}
                    setIsOpened={() => setWalletModal(false)}
                />
            </div>
        </div>
    )
}
