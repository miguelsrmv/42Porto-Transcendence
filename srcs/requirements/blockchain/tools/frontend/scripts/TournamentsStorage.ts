import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    console.error("Missing private key!");
    process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);
