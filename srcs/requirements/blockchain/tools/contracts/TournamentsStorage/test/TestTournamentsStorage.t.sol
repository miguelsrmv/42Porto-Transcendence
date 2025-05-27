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
        for (uint256 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            string memory enterName = string(abi.encodePacked("Mario", vm.toString(i)));

            participantsA[i] =
                TournamentsStorage.Participant({uniqueId: enterName, userAlias: enterName, character: enterName});
        }

        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participantsA);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participantsA);

        for (uint256 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
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
        for (uint256 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
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
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        uint256 totalNodes = n * 2 - 1;
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        // 1. Join all players
        for (uint256 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        // 2. Simulate bracket wins (left-side always wins)
        // matchedParticipants[0..n-1] are initial players
        for (uint256 round = 1; round < n; round *= 2) {
            for (uint256 i = 0; i < n; i += round * 2) {
                // Pick the left-side player of the current match
                uint256 leftIdx = i;
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
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // 1. Join all players
        for (uint256 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        // 2. Simulate bracket wins (right-side always wins)
        // matchedParticipants[0..n-1] are initial players
        uint256 score = 1;

        for (uint256 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i += 2) {
            // Pick the right-side player of the current match
            uint256 leftIdx = i;
            uint256 rightIdx = leftIdx + 1;
            uint256 loserScore = score++;
            uint256 winnerScore = score++;
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
        for (uint256 i = 0; i < (tournamentsStorage.MAX_PARTICIPANTS() - 1) * 2; i++) {
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
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        for (uint256 i = 0; i < n; i++) {
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
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());
        assertFalse(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CLASSIC));
        assertFalse(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CRAZY));

        // 1. Join all players
        for (uint256 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        assertTrue(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CLASSIC));
        assertTrue(tournamentsStorage.isTournamentFull(0, TournamentsStorage.gameType.CRAZY));
    }

    function testFindLastIndexOfPlayer() public {
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // 1. Join all players
        for (uint256 i = 0; i < n; i++) {
            string memory name = string(abi.encodePacked("P", vm.toString(i)));
            participants[i] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
        }
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CLASSIC, participants);
        tournamentsStorage.joinTournament(0, TournamentsStorage.gameType.CRAZY, participants);

        for (uint256 round = 1; round < n; round *= 2) {
            for (uint256 i = 0; i < n; i += round * 2) {
                uint256 leftIdx = i;
                string memory classicWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CLASSIC)[leftIdx].uniqueId;
                string memory crazyWinner =
                    tournamentsStorage.getMatchedParticipants(0, TournamentsStorage.gameType.CRAZY)[leftIdx].uniqueId;
                uint256 classicWinnerLastKnownIndex =
                    tournamentsStorage.findLastIndexOfPlayer(0, TournamentsStorage.gameType.CLASSIC, classicWinner);
                uint256 crazyWinnerLastKnownIndex =
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

    function testGetLastThreeTournamentsPosition() public {
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // Create 3 equal tournaments
        for (uint256 i = 0; i < 3; i++) {
            // 1. Join all players
            for (uint256 j = 0; j < n; j++) {
                string memory playerName = string(abi.encodePacked("P", vm.toString(j)));
                participants[j] =
                    TournamentsStorage.Participant({uniqueId: playerName, userAlias: playerName, character: playerName});
            }
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CLASSIC, participants);
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CRAZY, participants);

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint256 round = 1; round < n; round *= 2) {
                for (uint256 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint256 leftIdx = j;
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

        TournamentsStorage.TournamentIdAndType[3] memory classicData;
        TournamentsStorage.TournamentIdAndType[3] memory crazyData;

        for (uint256 i = 0; i < 3; i++) {
            classicData[i].id = i;
            classicData[i].gameType = TournamentsStorage.gameType.CLASSIC;
            crazyData[i].id = i;
            crazyData[i].gameType = TournamentsStorage.gameType.CRAZY;
        }

        string memory name = "P0";
        string[3] memory positions;
        positions[0] = "Tournament Winner!";
        positions[1] = "Tournament Winner!";
        positions[2] = "Tournament Winner!";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P1";
        positions[0] = "Quarter-final";
        positions[1] = "Quarter-final";
        positions[2] = "Quarter-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P2";
        positions[0] = "Semi-final";
        positions[1] = "Semi-final";
        positions[2] = "Semi-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P3";
        positions[0] = "Quarter-final";
        positions[1] = "Quarter-final";
        positions[2] = "Quarter-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P4";
        positions[0] = "Final";
        positions[1] = "Final";
        positions[2] = "Final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P5";
        positions[0] = "Quarter-final";
        positions[1] = "Quarter-final";
        positions[2] = "Quarter-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P6";
        positions[0] = "Semi-final";
        positions[1] = "Semi-final";
        positions[2] = "Semi-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }

        name = "P7";
        positions[0] = "Quarter-final";
        positions[1] = "Quarter-final";
        positions[2] = "Quarter-final";

        for (uint256 i = 0; i < 3; i++) {
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, classicData))[i], positions[i]);
            assertEq((tournamentsStorage.getLastThreeTournamentsPosition(name, crazyData))[i], positions[i]);
        }
    }

    function testGetTournamentsWonByPlayer() public {
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // Create 10 equal tournaments
        for (uint256 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint256 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                participants[j] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            }
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CLASSIC, participants);
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CRAZY, participants);

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint256 round = 1; round < n; round *= 2) {
                for (uint256 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint256 leftIdx = j;
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
        for (uint256 j = 1; j < n; j++) {
            string memory playerName = string(abi.encodePacked("P", vm.toString(j)));
            assertEq(tournamentsStorage.getTournamentsWonByPlayer(playerName, TournamentsStorage.gameType.CLASSIC), 0);
            assertEq(tournamentsStorage.getTournamentsWonByPlayer(playerName, TournamentsStorage.gameType.CRAZY), 0);
        }
    }

    function testGetNumberOfTournamentsParticipatedByPlayer() public {
        uint256 n = tournamentsStorage.MAX_PARTICIPANTS();
        TournamentsStorage.Participant[] memory participants =
            new TournamentsStorage.Participant[](tournamentsStorage.MAX_PARTICIPANTS());

        // Create 10 equal tournaments
        for (uint256 i = 0; i < 10; i++) {
            // 1. Join all players
            for (uint256 j = 0; j < n; j++) {
                string memory name = string(abi.encodePacked("P", vm.toString(j)));
                participants[j] = TournamentsStorage.Participant({uniqueId: name, userAlias: name, character: name});
            }
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CLASSIC, participants);
            tournamentsStorage.joinTournament(i, TournamentsStorage.gameType.CRAZY, participants);

            // 2. Simulate bracket wins (left-side always wins)
            // matchedParticipants[0..n-1] are initial players
            for (uint256 round = 1; round < n; round *= 2) {
                for (uint256 j = 0; j < n; j += round * 2) {
                    // Pick the left-side player of the current match
                    uint256 leftIdx = j;
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
        for (uint256 j = 1; j < n; j++) {
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
