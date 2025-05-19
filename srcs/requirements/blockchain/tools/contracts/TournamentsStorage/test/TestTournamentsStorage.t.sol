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
            tournamentsStorage.getAllTournaments(TournamentsStorage.gameType.CLASSIC).length,
            1,
            "Initial tournaments list should be 1"
        );
        assertEq(
            tournamentsStorage.getAllTournaments(TournamentsStorage.gameType.CRAZY).length,
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

    function testCreateTournament() public view {
        TournamentsStorage.Tournament[] memory classicTournaments =
            tournamentsStorage.getAllTournaments(TournamentsStorage.gameType.CLASSIC);
        assertEq(classicTournaments.length, 1);
        assertEq(classicTournaments[0].id, 0);
        assertEq(classicTournaments[0].maxParticipants, tournamentsStorage.MAX_PARTICIPANTS());

        TournamentsStorage.Tournament[] memory crazyTournaments =
            tournamentsStorage.getAllTournaments(TournamentsStorage.gameType.CLASSIC);
        assertEq(crazyTournaments.length, 1);
        assertEq(crazyTournaments[0].id, 0);
        assertEq(crazyTournaments[0].maxParticipants, tournamentsStorage.MAX_PARTICIPANTS());
    }

    function testSuccessfullyJoinedTournament() public {
        TournamentsStorage.Participant[] memory participantsA =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory enterName = string(abi.encodePacked("Mario", vm.toString(i)));

            participantsA[i] =
                TournamentsStorage.Participant({uniqueId: enterName, userAlias: enterName, character: enterName});
        }

        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participantsA);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participantsA);

        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory checkName = string(abi.encodePacked("Mario", vm.toString(i)));

            assertEq(tournamentsStorage.getParticipants(0, TournamentsStorage.gameType.CLASSIC)[i].uniqueId, checkName);
            assertEq(
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[i].uniqueId, checkName
            );

            assertEq(tournamentsStorage.getParticipants(0, TournamentsStorage.gameType.CRAZY)[i].uniqueId, checkName);
            assertEq(
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[i].uniqueId, checkName
            );
        }

        TournamentsStorage.Participant[] memory participantsB =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory enterName = string(abi.encodePacked("Bowser", vm.toString(i)));

            participantsB[i] =
                TournamentsStorage.Participant({uniqueId: enterName, userAlias: enterName, character: enterName});
        }

        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participantsB);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participantsB);

        assertEq(tournamentsStorage.getParticipants(1, TournamentsStorage.gameType.CLASSIC)[0].uniqueId, "Bowser0");
        assertEq(
            tournamentsStorage.getMatchedParticipants(1, TournamentsStorage.gameType.CLASSIC)[0].uniqueId, "Bowser0"
        );
        assertEq(tournamentsStorage.getParticipants(1, TournamentsStorage.gameType.CRAZY)[0].uniqueId, "Bowser0");
        assertEq(tournamentsStorage.getMatchedParticipants(1, TournamentsStorage.gameType.CRAZY)[0].uniqueId, "Bowser0");
    }

    function testAddWinner() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        uint256 totalNodes = n * 2 - 1;
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        // 2. Simulate bracket wins (left-side always wins)
        // matchedParticipants[0..n-1] are initial players
        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                // Pick the left-side player of the current match
                uint8 leftIdx = i;
                string memory classicWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[leftIdx].uniqueId;
                string memory crazyWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[leftIdx].uniqueId;

                // Compute winner index in tree
                tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
                tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CRAZY, crazyWinner);
            }
        }

        // 3. Final assertion: root node should hold the final winner
        string memory finalClassicWinner =
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[totalNodes - 1].uniqueId;
        string memory expectedClassicWinner =
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[0].uniqueId; // Player P0 (leftmost wins all)
        assertEq(finalClassicWinner, expectedClassicWinner, "Final winner should be leftmost player");

        string memory finalCrazyWinner =
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[totalNodes - 1].uniqueId;
        string memory expectedCrazyWinner =
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[0].uniqueId; // Player P0 (leftmost wins all)
        assertEq(finalCrazyWinner, expectedCrazyWinner, "Final winner should be leftmost player");
    }

    function testSaveScore() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        // 2. Simulate bracket wins (right-side always wins)
        // matchedParticipants[0..n-1] are initial players
        uint8 score = 1;

        for (uint8 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i += 2) {
            // Pick the right-side player of the current match
            uint8 leftIdx = i;
            uint8 rightIdx = leftIdx + 1;
            uint8 loserScore = score++;
            uint8 winnerScore = score++;
            string memory classicWinner =
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[rightIdx].uniqueId;
            string memory classicLoser =
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[leftIdx].uniqueId;
            string memory crazyWinner =
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[rightIdx].uniqueId;
            string memory crazyLoser =
                tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[leftIdx].uniqueId;

            tournamentsStorage.saveScore(
                0, TournamentsStorage.gameType.CLASSIC, classicLoser, loserScore, classicWinner, winnerScore
            );
            tournamentsStorage.saveScore(
                0, TournamentsStorage.gameType.CRAZY, crazyLoser, loserScore, crazyWinner, winnerScore
            );
            tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
            tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CRAZY, crazyWinner);
        }

        // 3. Final assertion: scores should co from 0 to (MAX_PARTICIPANTS - 1) * 2
        for (uint8 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i++) {
            assertEq(
                tournamentsStorage.getScores(0, TournamentsStorage.gameType.CLASSIC)[i],
                i + 1,
                "Final score should be ((MAX_PARTICIPANTS - 1) * 2) - 1"
            );
            assertEq(
                tournamentsStorage.getScores(0, TournamentsStorage.gameType.CRAZY)[i],
                i + 1,
                "Final score should be ((MAX_PARTICIPANTS - 1) * 2) - 1"
            );
        }
    }

    function testSaveScoreAndAddWinner() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        string memory p0 = string(abi.encodePacked("P0"));
        string memory p1 = string(abi.encodePacked("P1"));

        tournamentsStorage.saveScoreAndAddWinner(0, TournamentsStorage.gameType.CLASSIC, p0, 5, p1, 2);
        tournamentsStorage.saveScoreAndAddWinner(0, TournamentsStorage.gameType.CRAZY, p0, 5, p1, 2);

        uint256 winnerIndex = n;
        assertEq(
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[winnerIndex].uniqueId, p0
        );
        assertEq(tournamentsStorage.getScores(0, TournamentsStorage.gameType.CLASSIC)[0], 5);
        assertEq(tournamentsStorage.getScores(0, TournamentsStorage.gameType.CLASSIC)[1], 2);

        assertEq(
            tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[winnerIndex].uniqueId, p0
        );
        assertEq(tournamentsStorage.getScores(0, TournamentsStorage.gameType.CRAZY)[0], 5);
        assertEq(tournamentsStorage.getScores(0, TournamentsStorage.gameType.CRAZY)[1], 2);
    }

    function testIsTournamentFull() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        assertFalse(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CLASSIC));
        assertFalse(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CRAZY));

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        assertTrue(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CLASSIC));
        assertTrue(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CRAZY));
    }

    function testFindLastIndexOfPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // 1. Join all players
        for (uint8 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        for (uint8 round = 1; round < n; round *= 2) {
            for (uint8 i = 0; i < n; i += round * 2) {
                uint8 leftIdx = i;
                string memory classicWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[leftIdx].uniqueId;
                string memory crazyWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[leftIdx].uniqueId;
                uint8 classicWinnerLastKnownIndex =
                    tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
                uint8 crazyWinnerLastKnownIndex =
                    tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CRAZY, crazyWinner);

                assertEq(
                    classicWinner,
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[classicWinnerLastKnownIndex]
                        .uniqueId
                );
                assertEq(
                    crazyWinner,
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[crazyWinnerLastKnownIndex]
                        .uniqueId
                );

                tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
                tournamentsStorage.addWinner(0, TournamentsStorage.gameType.CRAZY, crazyWinner);

                // 2. Assertion: Last known index should have been updated
                classicWinnerLastKnownIndex =
                    tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
                crazyWinnerLastKnownIndex =
                    tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CRAZY, crazyWinner);

                assertEq(
                    classicWinner,
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[classicWinnerLastKnownIndex]
                        .uniqueId
                );
                assertEq(
                    crazyWinner,
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[crazyWinnerLastKnownIndex]
                        .uniqueId
                );
            }
        }
        vm.expectRevert();
        tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CLASSIC, "Non_participant");
        vm.expectRevert();
        tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CRAZY, "Non_participant");
    }

    function testGetTournamentsWonByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                participants[j] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            }
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CLASSIC, participants);
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CRAZY, participants);

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory classicWinner = tournamentsStorage.getMatchedParticipants(
                        i, TournamentsStorage.gameType.CLASSIC
                    )[leftIdx].uniqueId;
                    string memory crazyWinner = tournamentsStorage.getMatchedParticipants(
                        i, TournamentsStorage.gameType.CRAZY
                    )[leftIdx].uniqueId;

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, TournamentsStorage.gameType.CLASSIC, classicWinner);
                    tournamentsStorage.addWinner(i, TournamentsStorage.gameType.CRAZY, crazyWinner);
                }
            }
            tournamentsStorage.createTournament(TournamentsStorage.gameType.CLASSIC);
            tournamentsStorage.createTournament(TournamentsStorage.gameType.CRAZY);
        }
        // 3. Assertion: Player P0 has 10 tournaments won and the remaining 7 have none
        assertEq(tournamentsStorage.getTournamentsWonByPlayer("P0", TournamentsStorage.gameType.CLASSIC), 10);
        assertEq(tournamentsStorage.getTournamentsWonByPlayer("P0", TournamentsStorage.gameType.CRAZY), 10);
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(abi.encodePacked("P", vm.toString(j)));
            assertEq(tournamentsStorage.getTournamentsWonByPlayer(playerName, TournamentsStorage.gameType.CLASSIC), 0);
            assertEq(tournamentsStorage.getTournamentsWonByPlayer(playerName, TournamentsStorage.gameType.CRAZY), 0);
        }
    }

    function testGetNumberOfTournamentsParticipatedByPlayer() public {
        uint8 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // Create 10 equal tournaments
        for (uint8 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint8 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                participants[j] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            }
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CLASSIC, participants);
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CRAZY, participants);

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint8 round = 1; round < n; round *= 2) {
                for (uint8 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint8 leftIdx = j;
                    string memory clasicWinner = tournamentsStorage.getMatchedParticipants(
                        i, TournamentsStorage.gameType.CLASSIC
                    )[leftIdx].uniqueId;
                    string memory crazyWinner = tournamentsStorage.getMatchedParticipants(
                        i, TournamentsStorage.gameType.CRAZY
                    )[leftIdx].uniqueId;

                    // Compute winner index in tree
                    tournamentsStorage.addWinner(i, TournamentsStorage.gameType.CLASSIC, clasicWinner);
                    tournamentsStorage.addWinner(i, TournamentsStorage.gameType.CRAZY, crazyWinner);
                }
            }
            tournamentsStorage.createTournament(TournamentsStorage.gameType.CLASSIC);
            tournamentsStorage.createTournament(TournamentsStorage.gameType.CRAZY);
        }
        // 3. Assertion: Players from P0 to <MAX_PARTICIPANTS - 1> have participated in 10 tournaments
        // and a fictitious player didn't participate in any
        for (uint8 j = 1; j < n; j++) {
            string memory playerName = string(abi.encodePacked("P", vm.toString(j)));

            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    playerName, TournamentsStorage.gameType.CLASSIC
                ),
                10
            );
            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    "fictitiousPlayer", TournamentsStorage.gameType.CRAZY
                ),
                0
            );

            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    playerName, TournamentsStorage.gameType.CLASSIC
                ),
                10
            );
            assertEq(
                tournamentsStorage.getNumberOfTournamentsParticipatedByPlayer(
                    "fictitiousPlayer", TournamentsStorage.gameType.CRAZY
                ),
                0
            );
        }
    }
}
