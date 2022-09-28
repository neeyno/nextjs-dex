import { ConnectButton } from "web3uikit"
//import { useMoralis } from "react-moralis"
import { useState } from "react"
import Link from "next/link"
import styles from "../styles/Header.module.css"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//     faBars,
//     faCartShopping,
//     faCoins,
// } from "@fortawesome/free-solid-svg-icons"

export default function Header() {
    const [stateOpened, setStateOpened] = useState(false)
    function changeState() {
        setStateOpened(!stateOpened)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>DEX</h1>
                <Link href="/">
                    <a className={styles.home}>Exchange</a>
                </Link>
                <Link href="/pool">
                    <a className={styles.sell}>Pool</a>
                </Link>
                <div className={styles.connect}>
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
            <div className={styles.header_m}>
                <h1 className={styles.title}>NFT Market</h1>
                <div className={styles.popup_box} onClick={() => changeState()}>
                    <span></span>
                </div>
                {stateOpened ? (
                    <div className={styles.list}>
                        <Link href="/">
                            <a className={styles.home_m}>
                                Marketplace
                                <span></span>
                            </a>
                        </Link>
                        <Link href="/sell.html">
                            <a className={styles.sell_m}>
                                Sell NFT
                                <span></span>
                            </a>
                        </Link>
                        <div className={styles.connect_m}>
                            <ConnectButton moralisAuth={false} />
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}
