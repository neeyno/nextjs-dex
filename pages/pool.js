//import Head from "next/head"
//import Image from "next/image"

import styles from "../styles/Home.module.css"
import Pool from "../components/Pool.js"

export default function PoolPage() {
    return (
        <div className={styles.container}>
            <Pool />
        </div>
    )
}
