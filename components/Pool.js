import { ethers } from "ethers"

export default function Pool({
    liquidity,
    handleDepositClick,
    handleWithdrawClick,
}) {
    return (
        <div className="w-screen flex items-center justify-center mt-16 px-1">
            <div className="bg-gray-900 text-gray-100 w-[40rem] rounded-2xl p-2 sm:w-[40rem] sm:p-4">
                <div className="px-2 flex items-center justify-between font-semibold text-xl ">
                    <h1>Liquidity Pool</h1>
                    <button
                        className="bg-blue-800 rounded-xl py-1 px-4 cursor-pointer ease-in-out duration-150 hover:bg-blue-700"
                        onClick={handleDepositClick}
                    >
                        <span className="text-lg font-semibold sm:text-xl">
                            Deposit
                        </span>
                    </button>
                </div>
                <div className="mb-2 mt-4 mx-auto">
                    <div className="grid grid-cols-3 gap-2 text-center text-base">
                        <label className="text-gray-300">Pool name</label>
                        <label className="text-gray-300">Balance</label>
                        <label>{""}</label>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 text-center text-xl sm:text-2xl rounded-2xl border border-gray-700 ease-in-out duration-150 hover:border-gray-500">
                        <label className="my-auto">{liquidity.name}</label>
                        <label className="my-auto">
                            {liquidity.account === ""
                                ? "0"
                                : ethers.utils.formatUnits(
                                      liquidity.account,
                                      36
                                  )}
                        </label>
                        <button
                            className="bg-blue-800 rounded-xl py-1 mx-2 cursor-pointer ease-in-out duration-150 hover:bg-blue-700"
                            onClick={handleWithdrawClick}
                        >
                            <span className="text-lg font-semibold sm:text-xl">
                                Withdraw
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
