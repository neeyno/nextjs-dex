import { ethers } from "ethers"

const getAmountOut = (value, xReserve, yReserve) => {
    const xInput = value ? ethers.utils.parseEther(value) : 0
    // dy = y * dx / (x + dx)
    // const xInputWithFee = xInput * 998 // dx  // 0.2 % fee
    // const divisible = yReserve * xInputWithFee // y * dx
    // const divisor = xReserve * 1000 + xInputWithFee // (x + dx)
    // const dy = divisible / divisor

    const xInputWithFee = xInput.mul(998) // dx  // 0.2 % fee
    const divisible = yReserve.mul(xInputWithFee) // y * dx
    const divisor = xReserve.mul(1000).add(xInputWithFee) // (x + dx)
    const dy = divisible.div(divisor)
    return ethers.utils.formatUnits(dy, 18) // dy
}

const getAmountIn = (value, yReserve, xReserve) => {
    if (value >= parseInt(ethers.utils.formatUnits(yReserve, 18))) {
        return "99999999999999999999"
    }
    const yInput = value ? ethers.utils.parseEther(value) : 0

    // dx = x * dy / (y - dy)
    //const yInputWithFee = yInput.mul(1000) // dx  // 0.2 % fee
    const divisible = xReserve.mul(yInput).mul(1000) // y * dx
    const divisor = yReserve.sub(yInput) // (y - dy)
    const dx = divisible.div(divisor).div(998)
    return ethers.utils.formatUnits(dx, 18) // dx
}

module.exports = { getAmountOut, getAmountIn }
