//import { useEffect, useState } from "react"
//import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

import styles from "../styles/Update.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export default function UpdateModal({
    nftAddress,
    tokenId,
    oldPrice,
    closeModal,
    runUpdate,
    setPrice,
}) {
    //const [price, setPrice] = useState(oldPrice || "0")
    let valueToUpdate = oldPrice

    function handleChange(event) {
        const { value } = event.target
        setPrice(() =>
            ethers.utils.parseEther(value && value.length < 20 ? value : "0")
        )
    }

    return (
        <div className={styles.update}>
            <div className={styles.head}>
                <div className={styles.title}>New listing price</div>
                <button
                    className={styles.close_btn}
                    onClick={() => closeModal(false)}
                >
                    <span>
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                </button>
            </div>
            <div className={styles.main}>
                <div className={styles.nftAddress}>
                    <div>NFT contract address</div>
                    <span>{nftAddress}</span>
                </div>

                <div className={styles.tokenId}>
                    <div>Token ID</div>
                    <span>{tokenId}</span>
                </div>
                <div className={styles.price_input}>
                    <div>New price</div>
                    <input
                        id={"upd-input"}
                        type="number"
                        min="0"
                        step="0.1"
                        name="update"
                        placeholder={oldPrice}
                        onChange={(e) => handleChange(e)}
                    />
                    <label>Eth</label>
                </div>
                <hr />
                <button
                    className={styles.update_btn}
                    onClick={() => runUpdate()}
                >
                    Update price
                </button>
            </div>
        </div>
    )
}
