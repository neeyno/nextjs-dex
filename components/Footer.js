import React from "react"
import { useMoralis } from "react-moralis"
import Link from "next/link"

// React Icons
import { FaLinkedinIn, FaCodepen, FaGithub, FaTwitter } from "react-icons/fa"

export default function Footer() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex).toString() || "4"

    return (
        <div className="absolute bottom-0 w-screen">
            <div className="py-1 px-4 border-t border-t-gray-700 flex justify-between items-center max-w-6xl m-auto flex-row">
                <ul className="flex justify-center items-center gap-4">
                    <li className="text-gray-400 text-sm" title="Swap">
                        <Link href="/">
                            <a className="font-semibold ease-in-out duration-150 hover:text-white">
                                Swap
                            </a>
                        </Link>
                    </li>

                    <li className="text-gray-400 text-sm" title="Pool">
                        <Link href="/pool">
                            <a className="font-semibold ease-in-out duration-150 hover:text-white">
                                Pool
                            </a>
                        </Link>
                    </li>
                </ul>
                <h5 className="text-gray-400 font-initial text-sm">
                    Chain id ({chainId})
                </h5>
            </div>
            <div className="py-2 pt-0 px-2">
                <h5 className="text-gray-400 text-xs text-center leading-6">
                    {"Made with "}
                    <a
                        href="https://nextjs.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-gray-300 hover:text-blue-400"
                    >
                        Next.js
                    </a>
                    {" & "}
                    <a
                        href="https://tailwindcss.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-gray-300 hover:text-blue-400"
                    >
                        TailwindCSS
                    </a>
                    {"."}
                </h5>
            </div>
        </div>
    )
}
