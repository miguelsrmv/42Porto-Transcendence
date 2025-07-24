export const abi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_PARTICIPANTS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addWinner",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_winner",
        "type": "tuple",
        "internalType": "struct TournamentsStorage.Participant",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "classicTournamentsUUID",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "crazyTournamentsUUID",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createTournament",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_gameType",
        "type": "uint8",
        "internalType": "enum TournamentsStorage.gameType"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "findLastIndexOfPlayer",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllClassicTournamentsUUIDs",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllCrazyTournamentsUUIDs",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLastThreeTournamentsPosition",
    "inputs": [
      {
        "name": "_userId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_data",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string[3]",
        "internalType": "string[3]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMatchedParticipants",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[15]",
        "internalType": "struct TournamentsStorage.Participant[15]",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getParticipants",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[8]",
        "internalType": "struct TournamentsStorage.Participant[8]",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerTournamentScores",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_userId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string[4]",
        "internalType": "string[4]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getScores",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[14]",
        "internalType": "uint256[14]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTournament",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct TournamentsStorage.Tournament",
        "components": [
          {
            "name": "typeOfGame",
            "type": "uint8",
            "internalType": "enum TournamentsStorage.gameType"
          },
          {
            "name": "date",
            "type": "uint16[3]",
            "internalType": "uint16[3]"
          },
          {
            "name": "time",
            "type": "uint256[3]",
            "internalType": "uint256[3]"
          },
          {
            "name": "maxParticipants",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "participants",
            "type": "tuple[8]",
            "internalType": "struct TournamentsStorage.Participant[8]",
            "components": [
              {
                "name": "uniqueId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "userAlias",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "character",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "matchedParticipants",
            "type": "tuple[15]",
            "internalType": "struct TournamentsStorage.Participant[15]",
            "components": [
              {
                "name": "uniqueId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "userAlias",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "character",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "scores",
            "type": "uint256[14]",
            "internalType": "uint256[14]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinTournament",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_gameType",
        "type": "uint8",
        "internalType": "enum TournamentsStorage.gameType"
      },
      {
        "name": "_participants",
        "type": "tuple[]",
        "internalType": "struct TournamentsStorage.Participant[]",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "saveScore",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerOneUniqueId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerOneScore",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_playerTwoUniqueId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerTwoScore",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "saveScoreAndAddWinner",
    "inputs": [
      {
        "name": "_tournamentId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerOne",
        "type": "tuple",
        "internalType": "struct TournamentsStorage.Participant",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "_playerOneScore",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_playerTwo",
        "type": "tuple",
        "internalType": "struct TournamentsStorage.Participant",
        "components": [
          {
            "name": "uniqueId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "userAlias",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "character",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "_playerTwoScore",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
