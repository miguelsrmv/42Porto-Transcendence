import { ethers } from "ethers";

// Avalanche C-Chain RPC URL
const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

// MetaMask connection
async function connectWallet() {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return new ethers.providers.Web3Provider(window.ethereum);
    } else {
        console.error("MetaMask not detected.");
    }
}

// Contract details
const contractAddress = "0xYOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const contractABI = [
    {
        "inputs": [
            { "internalType": "uint32", "name": "_date", "type": "uint32" },
            { "internalType": "uint16", "name": "_time", "type": "uint16" }
        ],
        "name": "createTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTournaments",
        "outputs": [{ "internalType": "struct TournamentsStorage.Tournament[]", "type": "tuple[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getTournament",
        "outputs": [{ "internalType": "struct TournamentsStorage.Tournament", "type": "tuple" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getParticipants",
        "outputs": [{ "internalType": "string[]", "type": "string[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getScores",
        "outputs": [{ "internalType": "uint8[]", "type": "uint8[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_id", "type": "uint256" },
            { "internalType": "string", "name": "_participantName", "type": "string" }
        ],
        "name": "joinTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint8", "name": "matchId", "type": "uint8" },
            { "internalType": "uint8", "name": "scorePlayerOne", "type": "uint8" },
            { "internalType": "uint8", "name": "scorePlayerTwo", "type": "uint8" }
        ],
        "name": "saveScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Fetch all tournaments
async function getAllTournaments() {
    const provider = await connectWallet();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const tournaments = await contract.getTournaments();
    console.log("Tournaments:", tournaments);
}

// Fetch a specific tournament by ID
async function getTournament(id) {
    const provider = await connectWallet();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const tournament = await contract.getTournament(id);
    console.log(`Tournament ${id}:`, tournament);
}

// Get participants of a tournament
async function getParticipants(id) {
    const provider = await connectWallet();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const participants = await contract.getParticipants(id);
    console.log(`Participants in Tournament ${id}:`, participants);
}

// Get scores of a tournament
async function getScores(id) {
    const provider = await connectWallet();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const scores = await contract.getScores(id);
    console.log(`Scores for Tournament ${id}:`, scores);
}

// Create a new tournament
async function createTournament(date, time) {
    const provider = await connectWallet();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.createTournament(date, time);
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    console.log("Tournament created!");
}

// Join a tournament
async function joinTournament(id, participantName) {
    const provider = await connectWallet();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.joinTournament(id, participantName);
    console.log("Joining tournament:", tx.hash);

    await tx.wait();
    console.log(`Joined Tournament ${id} as ${participantName}!`);
}

// Save scores for a match
async function saveScore(matchId, scoreOne, scoreTwo) {
    const provider = await connectWallet();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.saveScore(matchId, scoreOne, scoreTwo);
    console.log("Saving scores:", tx.hash);

    await tx.wait();
    console.log(`Scores saved for Match ${matchId}: ${scoreOne} - ${scoreTwo}`);
}

// Example function calls
// getAllTournaments();
// getTournament(0);
// getParticipants(0);
// getScores(0);
// createTournament(20250320, 1400); // Example date: 2025-03-20, Time: 14:00
// joinTournament(0, "Alice");
// saveScore(0, 3, 2);
