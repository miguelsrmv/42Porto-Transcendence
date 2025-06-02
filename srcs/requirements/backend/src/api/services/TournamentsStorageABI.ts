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
        "name": "_winnerName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "getLastThreeTournamentsPosition",
    "inputs": [
      {
        "name": "_userId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_data",
        "type": "tuple[3]",
        "internalType": "struct TournamentsStorage.TournamentIdAndType[3]",
        "components": [
          {
            "name": "id",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "typeOfGame",
            "type": "uint8",
            "internalType": "enum TournamentsStorage.gameType"
          }
        ]
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
        "name": "_playerOneName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerOneScore",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_playerTwoName",
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
        "name": "_playerOneName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_playerOneScore",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_playerTwoName",
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
  }
];
