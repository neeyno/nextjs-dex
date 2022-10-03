import { useState } from "react"
import Link from "next/link"
import { ConnectButton } from "web3uikit"
import styles from "../styles/Navbar.module.css"

const Navbar = () => {
    const [menuOpen, SetMenuOpen] = useState(false)

    const closeMenu = () => {
        if (!menuOpen) {
            SetMenuOpen(menuOpen)
            menuOpen = true
        } else {
            SetMenuOpen(!menuOpen)
            menuOpen = false
        }
    }

    return (
        <header
            className={`py-3 px-2 flex justify-between items-center flex-wrap ${
                styles.header
            } ${menuOpen ? `${styles.open}` : ""}`}
        >
            <div className="z-50">
                <h2 className="text-2xl text-gray-100 font-bold sm:px-4">
                    <a href="/" title="DEX">
                        DEX
                    </a>
                </h2>
            </div>
            <nav>
                <ul
                    className={`menu hidden absolute left-0 top-0 m-0 py-20 pt-16 px-4 bg-[#0a0f18] z-40 w-full h-52 sm:w-unset sm:h-auto sm:bg-transparent sm:flex sm:py-0 sm:static sm:left-unset sm:top-unset ${
                        styles.menu
                    } ${menuOpen ? `${styles.open}` : ""}`}
                >
                    <li className="mb-5 mx-0 sm:my-auto sm:mx-5" title="swap">
                        <Link href="/">
                            <a
                                className="text-1xs text-gray-100 font-semibold ease-in-out duration-150 hover:text-blue-400"
                                onClick={() => closeMenu()}
                            >
                                Swap
                            </a>
                        </Link>
                    </li>

                    <li
                        className="mb-5 mt-2 mx-0 sm:my-auto sm:mx-5"
                        title="Pool"
                    >
                        <Link href="/pool">
                            <a
                                className="text-1xs text-gray-100 font-semibold ease-in-out duration-150 hover:text-blue-400"
                                onClick={() => closeMenu()}
                            >
                                Pool
                            </a>
                        </Link>
                    </li>

                    <li
                        className="mb-0 mt-0 mx-0 sm:my-auto sm:mx-5"
                        title="ConnectButton"
                    >
                        <ConnectButton moralisAuth={false} />
                    </li>
                </ul>
            </nav>
            <div
                className={`z-50 flex flex-col justify-center items-center sm:hidden ${
                    styles.hamburger
                } ${menuOpen ? `${styles.open}` : ""}`}
                onClick={() => SetMenuOpen(!menuOpen)}
            >
                <span className="h-0.5 w-7 mb-1.5 bg-white"></span>
                <span className="h-0.5 w-7 mb-1.5 bg-white"></span>
                <span className="h-0.5 w-7 mb-1.5 bg-white"></span>
            </div>
        </header>
    )
}

export default Navbar
