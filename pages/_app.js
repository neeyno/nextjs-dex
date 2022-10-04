import "../styles/globals.css"

import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Navbar from "../components/Navbar"
import Head from "next/head"
import Footer from "../components/Footer"

//import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
//const APP_ID = process.env.NEXT_PUBLIC_APP_ID
//const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
// const client = new ApolloClient({
//     cache: new InMemoryCache(),
//     uri: "https://api.studio.thegraph.com/query/32759/nft-marketplace/0.0.2",
// })
// <ApolloProvider client={client}></ApolloProvider>

function MyApp({ Component, pageProps }) {
    return (
        <>
            <MoralisProvider initializeOnMount={false}>
                <Head>
                    <title>Decentralized exchange</title>
                    <meta name="description" content="Decentralized exchange" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <NotificationProvider>
                    <Navbar />
                    <Component {...pageProps} />
                    <Footer />
                </NotificationProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp
