import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

import styles from "../styles/Update.module.css"
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//import { faXmark } from "@fortawesome/free-solid-svg-icons"

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
        <div className={styles.update}>
            <div className={styles.head}>
                <div className={styles.title}>Pools</div>
            </div>
            <div className={styles.main}>
                <div className={styles.price_input}>
                    <div>total pool</div>
                </div>
                <div>
                    <div>account pool</div>
                </div>
                <button
                    className={styles.pool_btn}
                    onClick={() => runAddPool()}
                >
                    add position
                </button>
            </div>
        </div>
    )
}
