import { ethers } from "ethers"

export default function WithdrawalModal({ liquidity, cancelWithdraw }) {
    return (
        <div className="grid grid-cols-3 gap-2 py-2 text-center text-xl sm:text-2xl rounded-2xl border border-gray-700 ease-in-out duration-150 hover:border-gray-500">
            <input
                className=""
                type="range"
                min="1"
                step="10"
                max="100"
                value="5"
                class="slider"
                id="myRange"
            />
            <div>
                <span>111</span>
            </div>

            <button
                className="bg-blue-800 rounded-xl py-1 px-4 cursor-pointer ease-in-out duration-150 hover:bg-blue-700"
                onClick={cancelWithdraw}
            >
                <span className="text-lg font-semibold sm:text-xl">Cancel</span>
            </button>
        </div>
    )
}
