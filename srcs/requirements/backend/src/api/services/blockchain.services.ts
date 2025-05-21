import { ethers } from 'ethers';
import { abi } from './TournamentsStorageABI'
import dotenv from "dotenv"
import fs from 'fs';

dotenv.config();

const RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc'; // C-Chain
const CONTRACT_ADDRESS = fs.readFileSync('/app/data/blockchain/blockchain_address.txt', 'utf-8').trim();
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

export { contract };