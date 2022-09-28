import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

import styles from "../styles/Update.module.css"
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//import { faXmark } from "@fortawesome/free-solid-svg-icons"

export default function Swap({
    assets,
    handleChange,
    handleBuyClick,
    handleReverse,
}) {
    return (
        <div className={styles.update}>
            <div className={styles.head}>
                <div className={styles.title}>Swap</div>
            </div>
            <div className={styles.main}>
                <div className={styles.price_input}>
                    <input
                        id="input1"
                        type="number"
                        min="0"
                        step="0.1"
                        name="firstVal"
                        value={assets.firstVal}
                        placeholder="asset1"
                        onChange={(e) => handleChange(e)}
                    />
                    <label>asset1</label>
                </div>
                <button onClick={() => handleReverse()}>change asset</button>

                <div className={styles.price_input}>
                    <div>
                        <input
                            id="input2"
                            type="number"
                            min="0"
                            step="0.1"
                            name="secondVal"
                            placeholder="asset2"
                            value={assets.secondVal}
                            onChange={(e) => handleChange(e)}
                        />
                        <label>asset2</label>
                    </div>
                </div>
                <hr />
                <button
                    className={styles.update_btn}
                    onClick={() => handleBuyClick()}
                >
                    buy
                </button>
            </div>
        </div>
    )
}
