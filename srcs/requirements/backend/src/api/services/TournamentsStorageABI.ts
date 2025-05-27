export const abi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'MAX_PARTICIPANTS',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addWinner',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
      {
        name: '_winnerName',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'classicTournaments',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'maxParticipants',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'crazyTournaments',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'maxParticipants',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createTournament',
    inputs: [
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'findLastIndexOfPlayer',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
      {
        name: '_playerName',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllTournaments',
    inputs: [
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct TournamentsStorage.Tournament[]',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'date',
            type: 'uint16[3]',
            internalType: 'uint16[3]',
          },
          {
            name: 'time',
            type: 'uint8[3]',
            internalType: 'uint8[3]',
          },
          {
            name: 'maxParticipants',
            type: 'uint8',
            internalType: 'uint8',
          },
          {
            name: 'participants',
            type: 'tuple[8]',
            internalType: 'struct TournamentsStorage.Participant[8]',
            components: [
              {
                name: 'uniqueId',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'userAlias',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'character',
                type: 'string',
                internalType: 'string',
              },
            ],
          },
          {
            name: 'matchedParticipants',
            type: 'tuple[15]',
            internalType: 'struct TournamentsStorage.Participant[15]',
            components: [
              {
                name: 'uniqueId',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'userAlias',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'character',
                type: 'string',
                internalType: 'string',
              },
            ],
          },
          {
            name: 'scores',
            type: 'uint8[14]',
            internalType: 'uint8[14]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLastThreeTournamentsPosition',
    inputs: [
      {
        name: 'userId',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'data',
        type: 'tuple[3]',
        internalType: 'struct TournamentsStorage.TournamentIdAndType[3]',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gameType',
            type: 'uint8',
            internalType: 'enum TournamentsStorage.gameType',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'string[3]',
        internalType: 'string[3]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMatchedParticipants',
    inputs: [
      {
        name: '_id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[15]',
        internalType: 'struct TournamentsStorage.Participant[15]',
        components: [
          {
            name: 'uniqueId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'userAlias',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'character',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNumberOfTournamentsParticipatedByPlayer',
    inputs: [
      {
        name: '_playerName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getParticipants',
    inputs: [
      {
        name: '_id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[8]',
        internalType: 'struct TournamentsStorage.Participant[8]',
        components: [
          {
            name: 'uniqueId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'userAlias',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'character',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getScores',
    inputs: [
      {
        name: '_id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8[14]',
        internalType: 'uint8[14]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTournament',
    inputs: [
      {
        name: '_id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct TournamentsStorage.Tournament',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'date',
            type: 'uint16[3]',
            internalType: 'uint16[3]',
          },
          {
            name: 'time',
            type: 'uint8[3]',
            internalType: 'uint8[3]',
          },
          {
            name: 'maxParticipants',
            type: 'uint8',
            internalType: 'uint8',
          },
          {
            name: 'participants',
            type: 'tuple[8]',
            internalType: 'struct TournamentsStorage.Participant[8]',
            components: [
              {
                name: 'uniqueId',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'userAlias',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'character',
                type: 'string',
                internalType: 'string',
              },
            ],
          },
          {
            name: 'matchedParticipants',
            type: 'tuple[15]',
            internalType: 'struct TournamentsStorage.Participant[15]',
            components: [
              {
                name: 'uniqueId',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'userAlias',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'character',
                type: 'string',
                internalType: 'string',
              },
            ],
          },
          {
            name: 'scores',
            type: 'uint8[14]',
            internalType: 'uint8[14]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTournamentsWonByPlayer',
    inputs: [
      {
        name: '_playerName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isTournamentFull',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'joinTournament',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
      {
        name: '_participants',
        type: 'tuple[]',
        internalType: 'struct TournamentsStorage.Participant[]',
        components: [
          {
            name: 'uniqueId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'userAlias',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'character',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'saveScore',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
      {
        name: '_playerOneName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_playerOneScore',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_playerTwoName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_playerTwoScore',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'saveScoreAndAddWinner',
    inputs: [
      {
        name: '_tournamentId',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_gameType',
        type: 'uint8',
        internalType: 'enum TournamentsStorage.gameType',
      },
      {
        name: '_playerOneName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_playerOneScore',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_playerTwoName',
        type: 'string',
        internalType: 'string',
      },
      {
        name: '_playerTwoScore',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];
