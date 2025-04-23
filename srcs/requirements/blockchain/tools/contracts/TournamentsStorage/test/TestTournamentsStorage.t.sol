// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {TournamentsStorage} from "../src/TournamentsStorage.sol";
import {DeployTournamentsStorage} from "../script/DeployTournamentsStorage.s.sol";

contract DeployTournamentsStorageTest is Test {
    DeployTournamentsStorage deployScript;

    function setUp() public {
        deployScript = new DeployTournamentsStorage();
    }

    function testDeployment() public {
        TournamentsStorage tournamentsStorage = deployScript.run();

        assert(address(tournamentsStorage) != address(0));

        assertEq(
            tournamentsStorage.getTournaments().length,
            1,
            "Initial tournaments list should be 1"
        );
    }
}

contract TournamentsStorageTest is Test {
    TournamentsStorage tournamentsStorage;

    function setUp() external {
        tournamentsStorage = new TournamentsStorage();
    }

    function testDeployTournamentsStorageScript() public {}

    function testCreateTournament() public view {
        TournamentsStorage.Tournament[] memory tournaments = tournamentsStorage
            .getTournaments();
        assertEq(tournaments.length, 1);
        assertEq(tournaments[0].id, 0);
        assertEq(
            tournaments[0].maxParticipants,
            tournamentsStorage.MAX_PARTICIPANTS()
        );
    }

    function testSuccessfullyJoinedTournament() public {
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, "Bob");
        }
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            assertEq(tournamentsStorage.getParticipants(0)[i], "Bob");
        }
        tournamentsStorage.joinTournament(0, "Eve");
        assertEq(tournamentsStorage.getParticipants(1)[0], "Eve");
    }

    function testAddWinner() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS(); // Must be power of 2
        uint256 totalNodes = n * 2 - 1;

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            tournamentsStorage.joinTournament(0, name);
        }

        // 2. Simulate bracket wins (left-side always wins)
        // matchedParticipants[0..n-1] are initial players
        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                // Pick the left-side player of the current match
                uint8 leftIdx = i;
                string memory winner = tournamentsStorage
                    .getMatchedParticipants(0)[leftIdx];

                // Compute winner index in tree
                tournamentsStorage.addWinner(0, winner);
            }
        }

        // 3. Final assertion: root node should hold the final winner
        string memory finalWinner = tournamentsStorage.getMatchedParticipants(
            0
        )[totalNodes - 1];

        string memory expectedWinner = tournamentsStorage
            .getMatchedParticipants(0)[0]; // Player P0 (leftmost wins all)

        assertEq(
            finalWinner,
            expectedWinner,
            "Final winner should be leftmost player"
        );
    }

    function testSaveScore() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS(); // Must be power of 2

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            tournamentsStorage.joinTournament(0, name);
        }

        // 2. Simulate bracket wins (right-side always wins)
        // matchedParticipants[0..n-1] are initial players
        uint8 score = 1;

        for (
            uint8 i = 0;
            i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2;
            i += 2
        ) {
            // Pick the right-side player of the current match
            uint8 leftIdx = i;
            uint8 rightIdx = leftIdx + 1;
            uint8 loserScore = score++;
            uint8 winnerScore = score++;
            string memory winner = tournamentsStorage.getMatchedParticipants(0)[
                rightIdx
            ];
            string memory loser = tournamentsStorage.getMatchedParticipants(0)[
                leftIdx
            ];
            tournamentsStorage.saveScore(
                0,
                loser,
                loserScore,
                winner,
                winnerScore
            );
            tournamentsStorage.addWinner(0, winner);
        }

        // 3. Final assertion: scores should co from 0 to (MAX_PARTICIPANTS - 1) * 2
        for (
            uint8 i = 0;
            i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2;
            i++
        ) {
            console.log("Index:", i);
            assertEq(
                tournamentsStorage.getScores(0)[i],
                i + 1,
                "Final score should be ((MAX_PARTICIPANTS - 1) * 2) - 1"
            );
        }
    }

    function testIsTournamentFull() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            tournamentsStorage.joinTournament(0, name);
        }
        assertTrue(tournamentsStorage.isTournamentFull(0));
    }

    function testFindLastIndexOfPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            tournamentsStorage.joinTournament(0, name);
        }
        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                uint8 leftIdx = i;
                string memory winner = tournamentsStorage
                    .getMatchedParticipants(0)[leftIdx];
                uint8 winnerLastKnownIndex = tournamentsStorage
                    .findLastIndexOfPlayer(0, winner);
                assertEq(
                    winner,
                    tournamentsStorage.getMatchedParticipants(0)[
                        winnerLastKnownIndex
                    ]
                );
                tournamentsStorage.addWinner(0, winner);
                // 2. Assertion: Last known index should have been updated
                winnerLastKnownIndex = tournamentsStorage.findLastIndexOfPlayer(
                        0,
                        winner
                    );
                assertEq(
                    winner,
                    tournamentsStorage.getMatchedParticipants(0)[
                        winnerLastKnownIndex
                    ]
                );
            }
        }
    }

    function testGetTournamentsWonByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS(); // Must be power of 2

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(
                    abi.encodePacked("P", vm.toString(j))
                );
                tournamentsStorage.joinTournament(i, name);
            }

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory winner = tournamentsStorage
                        .getMatchedParticipants(i)[leftIdx];

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, winner);
                }
            }
            tournamentsStorage.createTournament();
        }
        // 3. Assertion: Player P0 has 10 tournaments won and the remaining 7 have none
        assertEq(tournamentsStorage.getTournamentsWonByPlayer("P0"), 10);
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(
                abi.encodePacked("P", vm.toString(j))
            );
            assertEq(
                tournamentsStorage.getTournamentsWonByPlayer(playerName),
                0
            );
        }
    }

    function testGetNumberOfTournamentsParticipatedByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS(); // Must be power of 2

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(
                    abi.encodePacked("P", vm.toString(j))
                );
                tournamentsStorage.joinTournament(i, name);
            }

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory winner = tournamentsStorage
                        .getMatchedParticipants(i)[leftIdx];

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, winner);
                }
            }
            tournamentsStorage.createTournament();
        }
        // 3. Assertion: Players from P0 to <MAX_PARTICIPANTS - 1> have participated in 10 tournaments
        // and a fictitious player didn't participate in any
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(
                abi.encodePacked("P", vm.toString(j))
            );
            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    playerName
                ),
                10
            );
            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    "fictitiousPlayer"
                ),
                0
            );
        }
    }
}
