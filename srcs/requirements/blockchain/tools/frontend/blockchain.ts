import { ethers } from "ethers";
import { abi } from "./TournamentsStorageABI";

const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"; // C-Chain
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = "0x013f7a4A471450D51678a27568Dc224f208462A9";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

export { contract, wallet };
