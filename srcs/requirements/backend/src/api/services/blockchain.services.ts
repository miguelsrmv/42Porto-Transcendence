import { ethers } from 'ethers';
import { abi } from './TournamentsStorageABI';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc'; // C-Chain
const CONTRACT_ADDRESS = "0xb881D6F7CD48F6dE99E888600c46A1407b0D3913";/* fs
  .readFileSync('/app/data/blockchain/blockchain_address.txt', 'utf-8')
  .trim(); */
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractSigner = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
const contractProvider = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

export { contractSigner, contractProvider, wallet, provider };
