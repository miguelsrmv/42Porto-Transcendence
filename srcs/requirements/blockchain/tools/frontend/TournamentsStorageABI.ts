export const abi = [
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_tournamentId",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_winnerName",
                "type": "string"
            }
        ],
        "name": "addWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
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
                "internalType": "string[7]",
                "name": "",
                "type": "string[7]"
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
                "internalType": "string[4]",
                "name": "",
                "type": "string[4]"
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
                "internalType": "uint8[6]",
                "name": "",
                "type": "uint8[6]"
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
                        "internalType": "uint16[3]",
                        "name": "date",
                        "type": "uint16[3]"
                    },
                    {
                        "internalType": "uint8[3]",
                        "name": "time",
                        "type": "uint8[3]"
                    },
                    {
                        "internalType": "uint8",
                        "name": "maxParticipants",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[4]",
                        "name": "participants",
                        "type": "string[4]"
                    },
                    {
                        "internalType": "string[7]",
                        "name": "matchedParticipants",
                        "type": "string[7]"
                    },
                    {
                        "internalType": "uint8[6]",
                        "name": "scores",
                        "type": "uint8[6]"
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
                        "internalType": "uint16[3]",
                        "name": "date",
                        "type": "uint16[3]"
                    },
                    {
                        "internalType": "uint8[3]",
                        "name": "time",
                        "type": "uint8[3]"
                    },
                    {
                        "internalType": "uint8",
                        "name": "maxParticipants",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string[4]",
                        "name": "participants",
                        "type": "string[4]"
                    },
                    {
                        "internalType": "string[7]",
                        "name": "matchedParticipants",
                        "type": "string[7]"
                    },
                    {
                        "internalType": "uint8[6]",
                        "name": "scores",
                        "type": "uint8[6]"
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
                "name": "_tournamentId",
                "type": "uint256"
            }
        ],
        "name": "isTournamentFull",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tournamentId",
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
                "name": "_tournamentId",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_playerOneName",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "_playerOneScore",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_playerTwoName",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "_playerTwoScore",
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
                "internalType": "uint8",
                "name": "maxParticipants",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]