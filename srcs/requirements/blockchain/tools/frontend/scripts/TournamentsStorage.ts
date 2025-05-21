// import { ethers } from "ethers";
// import dotenv from "dotenv";

// dotenv.config();

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// const privateKey = process.env.PRIVATE_KEY;
// if (!privateKey) {
//     console.error("Missing private key!");
//     process.exit(1);
// }

// const wallet = new ethers.Wallet(privateKey, provider);

import {ethers} from "ethers";

// Extend the Window interface to include the ethereum property
declare global {
    interface Window {
        ethereum?: any;
    }
}

let signer = null;

let provider;
if (window.ethereum == null) {
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider();
} else {
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner();
}