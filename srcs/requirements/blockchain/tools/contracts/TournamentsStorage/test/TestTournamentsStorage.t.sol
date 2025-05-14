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

        assertEq(tournamentsStorage.getTournaments().length, 1, "Initial tournaments list should be 1");
    }
}

contract TournamentsStorageTest is Test {
    TournamentsStorage tournamentsStorage;

    function setUp() external {
        tournamentsStorage = new TournamentsStorage();
    }

    function testCreateTournament() public view {
        TournamentsStorage.Tournament[] memory tournaments = tournamentsStorage.getTournaments();
        assertEq(tournaments.length, 1);
        assertEq(tournaments[0].id, 0);
        assertEq(tournaments[0].maxParticipants, tournamentsStorage.MAX_PARTICIPANTS());
    }

    function testSuccessfullyJoinedTournament() public {
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory enterName = string(abi.encodePacked("Mario", vm.toString(i)));

            TournamentsStorage.Participant memory player1 =
                TournamentsStorage.Participant({uniqueId: enterName, userAlias: enterName, character: enterName});
            tournamentsStorage.joinTournament(0, player1);
        }
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory checkName = string(abi.encodePacked("Mario", vm.toString(i)));

            assertEq(tournamentsStorage.getParticipants(0)[i].uniqueId, checkName);
            assertEq(tournamentsStorage.getMatchedParticipants(0)[i].uniqueId, checkName);
        }

        string memory name = "Bowser";

        TournamentsStorage.Participant memory player2 =
            TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});

        tournamentsStorage.joinTournament(0, player2);
        assertEq(tournamentsStorage.getParticipants(1)[0].uniqueId, player2.uniqueId);
        assertEq(tournamentsStorage.getMatchedParticipants(1)[0].uniqueId, player2.uniqueId);

        vm.expectRevert();
        tournamentsStorage.joinTournament(0, player2);
    }

    function testAddWinner() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        uint256 totalNodes = n * 2 - 1;

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            TournamentsStorage.Participant memory player =
                TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            tournamentsStorage.joinTournament(0, player);
        }

        // 2. Simulate bracket wins (left-side always wins)
        // matchedParticipants[0..n-1] are initial players
        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                // Pick the left-side player of the current match
                uint8 leftIdx = i;
                string memory winner = tournamentsStorage.getMatchedParticipants(0)[leftIdx].uniqueId;

                // Compute winner index in tree
                tournamentsStorage.addWinner(0, winner);
            }
        }

        // 3. Final assertion: root node should hold the final winner
        string memory finalWinner = tournamentsStorage.getMatchedParticipants(0)[totalNodes - 1].uniqueId;

        string memory expectedWinner = tournamentsStorage.getMatchedParticipants(0)[0].uniqueId; // Player P0 (leftmost wins all)

        assertEq(finalWinner, expectedWinner, "Final winner should be leftmost player");
    }

    function testSaveScore() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            TournamentsStorage.Participant memory player =
                TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            tournamentsStorage.joinTournament(0, player);
        }

        // 2. Simulate bracket wins (right-side always wins)
        // matchedParticipants[0..n-1] are initial players
        uint8 score = 1;

        for (uint8 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i += 2) {
            // Pick the right-side player of the current match
            uint8 leftIdx = i;
            uint8 rightIdx = leftIdx + 1;
            uint8 loserScore = score++;
            uint8 winnerScore = score++;
            string memory winner = tournamentsStorage.getMatchedParticipants(0)[rightIdx].uniqueId;
            string memory loser = tournamentsStorage.getMatchedParticipants(0)[leftIdx].uniqueId;
            tournamentsStorage.saveScore(0, loser, loserScore, winner, winnerScore);
            tournamentsStorage.addWinner(0, winner);
        }

        // 3. Final assertion: scores should co from 0 to (MAX_PARTICIPANTS - 1) * 2
        for (uint8 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i++) {
            console.log("Index:", i);
            assertEq(
                tournamentsStorage.getScores(0)[i], i + 1, "Final score should be ((MAX_PARTICIPANTS - 1) * 2) - 1"
            );
        }
    }

    function testSaveScoreAndAddWinner() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            TournamentsStorage.Participant memory player =
                TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            tournamentsStorage.joinTournament(0, player);
        }

        string memory p0 = string(abi.encodePacked("P0"));
        string memory p1 = string(abi.encodePacked("P1"));

        tournamentsStorage.saveScoreAndAddWinner(0, p0, 5, p1, 2);

        uint256 winnerIndex = n;
        assertEq(tournamentsStorage.getMatchedParticipants(0)[winnerIndex].uniqueId, p0);
        assertEq(tournamentsStorage.getScores(0)[0], 5);
        assertEq(tournamentsStorage.getScores(0)[1], 2);
    }

    function testIsTournamentFull() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        assertFalse(tournamentsStorage.isTournamentFull(0));

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            TournamentsStorage.Participant memory player =
                TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            tournamentsStorage.joinTournament(0, player);
        }
        assertTrue(tournamentsStorage.isTournamentFull(0));
    }

    function testFindLastIndexOfPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            TournamentsStorage.Participant memory player =
                TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            tournamentsStorage.joinTournament(0, player);
        }
        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                uint8 leftIdx = i;
                string memory winner = tournamentsStorage.getMatchedParticipants(0)[leftIdx].uniqueId;
                uint8 winnerLastKnownIndex = tournamentsStorage.findLastIndexOfPlayer(0, winner);
                assertEq(winner, tournamentsStorage.getMatchedParticipants(0)[winnerLastKnownIndex].uniqueId);
                tournamentsStorage.addWinner(0, winner);
                // 2. Assertion: Last known index should have been updated
                winnerLastKnownIndex = tournamentsStorage.findLastIndexOfPlayer(0, winner);
                assertEq(winner, tournamentsStorage.getMatchedParticipants(0)[winnerLastKnownIndex].uniqueId);
            }
        }
        vm.expectRevert();
        tournamentsStorage.findLastIndexOfPlayer(0, "Non_participant");
    }

    function testGetTournamentsWonByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                TournamentsStorage.Participant memory player =
                    TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
                tournamentsStorage.joinTournament(i, player);
            }

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory winner = tournamentsStorage.getMatchedParticipants(i)[leftIdx].uniqueId;

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, winner);
                }
            }
            tournamentsStorage.createTournament();
        }
        // 3. Assertion: Player P0 has 10 tournaments won and the remaining 7 have none
        assertEq(tournamentsStorage.getTournamentsWonByPlayer("P0"), 10);
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(abi.encodePacked("P", vm.toString(j)));
            assertEq(tournamentsStorage.getTournamentsWonByPlayer(playerName), 0);
        }
    }

    function testGetNumberOfTournamentsParticipatedByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                TournamentsStorage.Participant memory player =
                    TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
                tournamentsStorage.joinTournament(i, player);
            }

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory winner = tournamentsStorage.getMatchedParticipants(i)[leftIdx].uniqueId;

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, winner);
                }
            }
            tournamentsStorage.createTournament();
        }
        // 3. Assertion: Players from P0 to <MAX_PARTICIPANTS - 1> have participated in 10 tournaments
        // and a fictitious player didn't participate in any
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(abi.encodePacked("P", vm.toString(j)));
            assertEq(tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(playerName), 10);
            assertEq(tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer("fictitiousPlayer"), 0);
        }
    }
}
