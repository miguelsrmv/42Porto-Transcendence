# Project Notes: TournamentsStorage Contract

**Last Updated:** 2025-07-25

## File Structure

```
blockchain
 ┣ conf
 ┃ ┗ output
 ┃ ┃ ┗ blockchain_address.txt                      # File generated on contract deployment - contains smart contract's address
 ┣ tools
 ┃ ┗ contracts
 ┃ ┃ ┗ TournamentsStorage
 ┃ ┃ ┃ ┣ lib
 ┃ ┃ ┃ ┃ ┣ forge-std                               # Foundry standard library for smart contract testing and scripting
 ┃ ┃ ┃ ┃ ┃ ┣ scripts
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ vm.py                               # Helper script for interacting with the Foundry virtual machine (VM)
 ┃ ┃ ┃ ┃ ┃ ┣ src                                   # Core source files for the forge-std library, including base contracts,
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ interfaces                          # Interface definitions for standard Ethereum token protocols and utility contracts
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ IERC1155.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ IERC165.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ IERC20.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ IERC4626.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ IERC721.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ IMulticall3.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ Base.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ Script.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdAssertions.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdChains.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdCheats.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdError.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdInvariant.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdJson.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdMath.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdStorage.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdStyle.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdToml.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdUtils.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ Test.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ Vm.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ console.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ console2.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ safeconsole.sol
 ┃ ┃ ┃ ┃ ┃ ┣ test                                  # Test contracts for forge-std components and utilities, including cheat codes,
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ compilation                         # Tests and scripts related to contract compilation scenarios
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ CompilationScript.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ CompilationScriptBase.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ CompilationTest.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ CompilationTestBase.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ fixtures                            # Test fixture files including logs and configuration samples
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ broadcast.log.json
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ test.json
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ test.toml
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdAssertions.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdChains.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdCheats.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdError.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdJson.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdMath.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdStorage.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdStyle.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdToml.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ StdUtils.t.sol
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ Vm.t.sol
 ┃ ┃ ┃ ┃ ┃ ┣ .gitattributes
 ┃ ┃ ┃ ┃ ┃ ┣ .gitignore
 ┃ ┃ ┃ ┃ ┃ ┣ foundry.toml                          # Configuration specific to the forge-std project
 ┃ ┃ ┃ ┃ ┃ ┗ package.json                          # Node.js package manifest
 ┃ ┃ ┃ ┃ ┗ openzeppelin-contracts                  # OpenZeppelin library used for secure smart contract development (standard practice)
 ┃ ┃ ┃ ┣ script
 ┃ ┃ ┃ ┃ ┗ DeployTournamentsStorage.s.sol          # Deployment script for the `TournamentsStorage` contract
 ┃ ┃ ┃ ┣ src
 ┃ ┃ ┃ ┃ ┗ TournamentsStorage.sol                  # Main contract source that stores tournament data
 ┃ ┃ ┃ ┣ test
 ┃ ┃ ┃ ┃ ┗ TournamentsStorage.t.sol                # Unit tests for the `TournamentsStorage` contract
 ┃ ┃ ┃ ┣ .gitignore
 ┃ ┃ ┃ ┗ foundry.toml                              # Main configuration file for the Foundry-based smart contract project
 ┣ .dockerignore
 ┣ Dockerfile                                      # Dockerfile defining containerized environment for deploying/testing smart contracts
 ┣ NOTES.md                                        # Developer notes and miscellaneous information related to project setup or usage
 ┗ deploy.sh                                       # Entrypoint script used by Docker to build and deploy the smart contract
 ```

---

## Table of Contents

- [Project Notes: TournamentsStorage Contract](#project-notes-tournamentsstorage-contract)
	- [File Structure](#file-structure)
	- [Table of Contents](#table-of-contents)
	- [Project Overview](#project-overview)
	- [Contract Architecture \& Core Concepts](#contract-architecture--core-concepts)
		- [Single-Elimination Bracket](#single-elimination-bracket)
	- [State Variables \& Data Structures](#state-variables--data-structures)
		- [Constants and Immutables](#constants-and-immutables)
		- [Primary Storage](#primary-storage)
		- [Structs](#structs)
		- [Enums](#enums)
	- [Functions Breakdown](#functions-breakdown)
		- [Owner-Only Functions (Actions)](#owner-only-functions-actions)
		- [Public Getter Functions (Views)](#public-getter-functions-views)
		- [Internal \& Helper Functions](#internal--helper-functions)
	- [Future Ideas \& Todos](#future-ideas--todos)

---

## Project Overview

This project consists of a single Solidity smart contract, `TournamentsStorage.sol`, designed to act as a decentralized backend for managing single-elimination tournaments. The contract handles the creation of tournaments, registration of participants, tracking of match scores, and the automatic progression of winners through a tournament bracket.

Its primary features are:
*   Immutable ownership, where the deployer is the sole administrator.
*   Support for a fixed number of participants (`MAX_PARTICIPANTS = 8`).
*   Categorization of tournaments into `CLASSIC` and `CRAZY` types.
*   Detailed storage structures for tournament data, including participants, brackets, and scores.
*   Owner-restricted functions for creating tournaments and managing match outcomes.
*   Public-facing functions to read tournament data, participant stats, and match results.

---

## Contract Architecture & Core Concepts

The contract is built around a central `tournamentsMap` mapping, which links a unique string ID (UUID) to a `Tournament` struct. This `Tournament` struct holds all the necessary information for a single tournament event.

### Single-Elimination Bracket

The core logic revolves around the `matchedParticipants` array, which represents the entire tournament bracket.

*   **Size**: The array has a size of `MAX_PARTICIPANTS * 2 - 1` (i.e., for 8 participants, the size is 15).
*   **Initial Participants (Indices 0 to 7)**: The first `MAX_PARTICIPANTS` slots are filled with the initial players.
*   **Winner Progression (Indices 8 to 14)**: Subsequent slots are reserved for the winners of each match. For example:
    *   The winner of the match between `matchedParticipants[0]` and `matchedParticipants[1]` will be placed at `matchedParticipants[8]`.
    *   The winner of the match between `matchedParticipants[2]` and `matchedParticipants[3]` will be placed at `matchedParticipants[9]`.
    *   This continues until the final tournament winner is placed at the last index (`matchedParticipants[14]`).

The `scores` array directly corresponds to the player slots in the `matchedParticipants` array, allowing for score lookups for any given match.

---

## State Variables & Data Structures

### Constants and Immutables

| Name               | Type    | Description                                                                 |
| :----------------- | :------ | :-------------------------------------------------------------------------- |
| `i_owner`          | `address` | **Immutable**. Stores the contract deployer's address as the owner.       |
| `MAX_PARTICIPANTS` | `uint256` | **Constant**. The fixed number of participants per tournament, set to 8.    |

### Primary Storage

| Name                     | Type                     | Description                                                            |
| :----------------------- | :----------------------- | :--------------------------------------------------------------------- |
| `tournamentsMap`         | `mapping(string => Tournament)` | The main mapping from a tournament's UUID to its `Tournament` data.      |
| `classicTournamentsUUID` | `string[]`               | An array storing all UUIDs for tournaments of type `CLASSIC`.        |
| `crazyTournamentsUUID`   | `string[]`               | An array storing all UUIDs for tournaments of type `CRAZY`.          |

### Structs

The contract uses two structs to organize data: `Participant` and `Tournament`.

```solidity
// Represents a single participant in a tournament.
struct Participant {
    string uniqueId; // A unique identifier for the user.
    string userAlias; // The user's display name.
    string character; // The character or avatar chosen by the user.
}

// Represents the entire state of a single tournament.
struct Tournament {
    gameType typeOfGame; // The type of the tournament (CLASSIC or CRAZY).
    uint16[3] date; // The creation date [day, month, year].
    uint256[3] time; // The creation time [hour, minute, second] in UTC.
    uint256 maxParticipants; // The maximum number of participants.
    Participant[MAX_PARTICIPANTS] participants; // Initial list of registered participants.
    Participant[MAX_PARTICIPANTS * 2 - 1] matchedParticipants; // The full tournament bracket.
    uint256[(MAX_PARTICIPANTS - 1) * 2] scores; // Scores for each match.
}
```

### Enums

A single enum, `gameType`, is used to differentiate tournaments.

```solidity
// Defines the type of game for a tournament.
enum gameType {
    CLASSIC,
    CRAZY
}
```

---

## Functions Breakdown

### Owner-Only Functions (Actions)

These functions can only be called by the `i_owner` and are used to modify the contract's state.

*   `createTournament(string, gameType)`: Initializes a new, empty tournament.
*   `joinTournament(string, gameType, Participant[])`: A helper that creates a tournament and populates it with an initial list of participants.
*   `addWinner(string, Participant)`: Advances a winning player to their next slot in the `matchedParticipants` bracket.
*   `saveScore(string, string, uint256, string, uint256)`: Saves the scores for two players in a specific match.
*   `saveScoreAndAddWinner(string, Participant, uint256, Participant, uint256)`: A convenience function that saves scores and automatically promotes the winner.

### Public Getter Functions (Views)

These functions are read-only and can be called by anyone to query data from the contract.

*   `getAllClassicTournamentsUUIDs()`: Returns all UUIDs for `CLASSIC` tournaments.
*   `getAllCrazyTournamentsUUIDs()`: Returns all UUIDs for `CRAZY` tournaments.
*   `getTournament(string)`: Fetches all data for a specific tournament.
*   `getParticipants(string)`: Returns the initial list of 8 participants for a tournament.
*   `getMatchedParticipants(string)`: Returns the full tournament bracket (15 participants).
*   `getScores(string)`: Returns all scores for a tournament.
*   `getLastThreeTournamentsPosition(string, string[])`: Calculates a player's placement (e.g., "Final", "Semi-final") in their last three tournaments.
*   `getPlayerTournamentScores(string, string)`: Retrieves a player's alias and all their scores from a specific tournament.

### Internal & Helper Functions

These functions support the main contract logic and are not exposed publicly.

*   `getCurrentTimestamp()`: Returns `block.timestamp`.
*   `_daysToDate(uint256)`: Converts a number of days since the Unix epoch into a `year, month, day` format.
*   `getCurrentDateTimeUTC()`: Uses the above functions to provide the full current date and time.
*   `getCurrentDate()` / `getCurrentTime()`: Return formatted date and time arrays.
*   `findLastIndexOfPlayer(string, string)`: A crucial public view function that finds the most advanced position (highest index) of a player within the `matchedParticipants` array. This is key for determining who won and where to place scores.

---

## Future Ideas & Todos

*   **Gas Optimization:** The extensive use of strings and loops can be gas-intensive. Explore using `bytes32` for IDs or alternative data structures to reduce costs.
*   **Dynamic `MAX_PARTICIPANTS`:** Modify the contract to support a variable number of participants (e.g., 4, 16, 32), though this would significantly increase complexity.
*   **Event Emission:** Add events for critical actions like `TournamentCreated`, `WinnerAdded`, and `ScoreSaved`. This would improve off-chain monitoring and dApp integration.
*   **Entrance Fees & Payouts:** Implement logic to handle cryptocurrency entrance fees and automatically distribute a prize pool to the winner(s).
*   **Write a comprehensive test suite:** Develop tests to cover all functions and edge cases, especially the winner progression and score-saving logic.