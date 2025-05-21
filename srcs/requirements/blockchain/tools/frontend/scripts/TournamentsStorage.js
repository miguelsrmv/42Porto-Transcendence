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
const contractAddress = "0x013f7a4A471450D51678a27568Dc224f208462A9"; // Replace with your deployed contract address
const contractABI = import("../TournamentsStorageABI.json");

// Fetch all tournaments
async function getAllTournaments() {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(await contract.getTournaments());
}

// Fetch a tournament
async function getTournament(tournamentId) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

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
            participants: tournamentData.participants.map(p => p.trim()), // Remove empty strings if needed
            matchedParticipants: tournamentData.matchedParticipants.map(p => p.trim()),
            scores: tournamentData.scores.map(score => Number(score)) // Ensure scores are numbers
        };

        console.log("Fetched Tournament:", tournament);
        return tournament;
    } catch (error) {
        console.error("Error fetching tournament:", error);
    }
}

// Fetch participants of a tournament
async function getParticipants(id) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
        if (!contract) throw new Error("Contract is not defined!");

        let participants = await contract.getParticipants(id);

        if (!participants || !Array.isArray(participants)) {
            console.error("Invalid participants data:", participants);
            return [];
        }

        const formattedParticipants = participants.map(p => p.toString().trim());

        console.log("Formatted Participants:", formattedParticipants);
        return formattedParticipants;
    } catch (error) {
        console.error("Error in getParticipants:", error);
        return [];
    }
}

// Fetch matched participants
async function getMatchedParticipants(id) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
        const matchedParticipants = await contract.getMatchedParticipants(id);

        if (!matchedParticipants || !Array.isArray(matchedParticipants)) {
            console.error("Invalid matched participants data:", matchedParticipants);
            return [];
        }

        const formattedMatchedParticipants = matchedParticipants.map(p => p.toString().trim()); // Format and trim

        console.log("Formatted Matched Participants:", formattedMatchedParticipants);
        return formattedMatchedParticipants;
    } catch (error) {
        console.error("Error in getMatchedParticipants:", error);
        return [];
    }
}

// Fetch scores of a tournament
async function getScores(id) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
        const scores = await contract.getScores(id);

        if (!scores || !Array.isArray(scores)) {
            console.error("Invalid scores data:", scores);
            return [];
        }

        const formattedScores = scores.map(score => Number(score)); // Ensure the scores are numbers

        console.log("Formatted Scores:", formattedScores);
        return formattedScores;
    } catch (error) {
        console.error("Error in getScores:", error);
        return [];
    }
}


// Create a new tournament
async function createTournament() {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.createTournament();
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    // console.log("Tournament created!");
}

// Join a tournament
async function joinTournament(tournamentId, participantName) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const isTournamentFull = await contract.isTournamentFull(tournamentId);
    if (!isTournamentFull) {
        const tx = await contract.joinTournament(tournamentId, participantName);
        console.log("Joining tournament:", tx.hash);
        await tx.wait();
        // console.log(`Joined Tournament ${tournamentId} as ${participantName}!`);
    }
    else {
        await createTournament();
        await joinTournament(tournamentId + 1, participantName);
    }
}

// Add a winner to a tournament
async function addWinner(tournamentId, winnerName) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.addWinner(tournamentId, winnerName);
    console.log("Joining tournament:", tx.hash);
    await tx.wait();
    // console.log(`Added winner ${winnerName} to tournament: ${tournamentId}!`);
}

// Save scores for a match
async function saveScore(tournamentId, playerOneName, playerScoreOne, playerTwoName, playerScoreTwo) {
    const provider = await connectWallet();
    if (!provider) {
        console.error("Wallet connection failed.");
        return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.saveScore(tournamentId, playerOneName, playerScoreOne, playerTwoName, playerScoreTwo);
    console.log("Saving scores:", tx.hash);
    await tx.wait();
    console.log(`Scores saved for Tournament ${tournamentId}: ${playerOneName} ${playerScoreOne} - ${playerTwoName} ${playerScoreTwo}`);
}
