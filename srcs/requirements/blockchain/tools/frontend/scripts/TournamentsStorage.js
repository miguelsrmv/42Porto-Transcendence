// Avalanche C-Chain RPC URL
const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

// Detect multiple wallet providers
async function connectWallet() {
    let provider;

    if (window.ethereum) {
        // Check if multiple wallets exist
        if (window.ethereum.providers?.length) {
            provider = window.ethereum.providers.find((prov) => prov.isMetaMask) || window.ethereum.providers[0];
        } else {
            provider = window.ethereum;
        }
    }

    if (!provider) {
        alert("No Ethereum wallet detected. Please install MetaMask or another wallet.");
        return null;
    }

    try {
        await provider.request({ method: "eth_requestAccounts" });
        return new ethers.providers.Web3Provider(provider);
    } catch (error) {
        console.error("User rejected wallet connection:", error);
        return null;
    }
}

// Contract details
const contractAddress = "0xF0C67A909AF380C1248560be49c1ad9ccf5853d7"; // Replace with your deployed contract address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_date",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "_time",
                "type": "uint16"
            }
        ],
        "name": "createTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getMatchedParticipants",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getParticipants",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getScores",
        "outputs": [
            {
                "internalType": "uint8[]",
                "name": "",
                "type": "uint8[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getTournament",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "date",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint16",
                        "name": "time",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "maxParticipants",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "participants",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string[]",
                        "name": "matchedParticipants",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint8[]",
                        "name": "scores",
                        "type": "uint8[]"
                    }
                ],
                "internalType": "struct TournamentsStorage.Tournament",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTournaments",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "date",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint16",
                        "name": "time",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "maxParticipants",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[]",
                        "name": "participants",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string[]",
                        "name": "matchedParticipants",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint8[]",
                        "name": "scores",
                        "type": "uint8[]"
                    }
                ],
                "internalType": "struct TournamentsStorage.Tournament[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_participantName",
                "type": "string"
            }
        ],
        "name": "joinTournament",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "matchId",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "scorePlayerOne",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "scorePlayerTwo",
                "type": "uint8"
            }
        ],
        "name": "saveScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tournaments",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint32",
                "name": "date",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "time",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "maxParticipants",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Fetch all tournaments
async function getAllTournaments() {
    const provider = await connectWallet();
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(await contract.getTournaments());
}

// Fetch a tournament
async function getTournament(tournamentId) {
    const provider = await connectWallet();
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
        const tournamentData = await contract.getTournament(tournamentId);

        if (!tournamentData || tournamentData.id === undefined) {
            console.error("Tournament not found");
            return;
        }

        const tournament = {
            id: tournamentData.id.toString(),
            date: tournamentData.date.toString(),
            time: tournamentData.time.toString(),
            maxParticipants: tournamentData.maxParticipants.toString(),
            participants: tournamentData.participants,
            matchedParticipants: tournamentData.matchedParticipants,
            scores: tournamentData.scores.map(score => score.toNumber())
        };

        console.log("Fetched Tournament:", tournament);
    } catch (error) {
        console.error("Error fetching tournament:", error);
    }
}

// Fetch participants of a tournament
async function getParticipants(id) {
    const provider = await connectWallet();
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(await contract.getParticipants(id));
}

// Fetch matched participants
async function getMatchedParticipants(id) {
    const provider = await connectWallet();
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(await contract.getMatchedParticipants(id));
}

// Fetch scores of a tournament
async function getScores(id) {
    const provider = await connectWallet();
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(await contract.getScores(id));
}

// Create a new tournament
async function createTournament(date, time) {
    const provider = await connectWallet();
    if (!provider) return;

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
    if (!provider) return;

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
    if (!provider) return;

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.saveScore(matchId, scoreOne, scoreTwo);
    console.log("Saving scores:", tx.hash);
    await tx.wait();
    console.log(`Scores saved for Match ${matchId}: ${scoreOne} - ${scoreTwo}`);
}
