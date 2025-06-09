// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {TournamentsStorage} from "../src/TournamentsStorage.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

contract TournamentsStorageTest is Test {
    using Strings for uint256;

    uint256 private constant TEST_MAX_PARTICIPANTS = 8;

    TournamentsStorage internal tournamentsStorage;
    address internal owner;
    address internal user1;
    address internal user2;

    TournamentsStorage.Participant[] internal testParticipants;
    string internal testTournamentId = "test-tourney-123";

    function setUp() public {
        tournamentsStorage = new TournamentsStorage();
        owner = address(this);

        user1 = vm.addr(1);
        user2 = vm.addr(2);

        testParticipants = new TournamentsStorage.Participant[](TEST_MAX_PARTICIPANTS);
        for (uint256 i = 0; i < TEST_MAX_PARTICIPANTS; i++) {
            string memory userId = string.concat("user", (i + 1).toString());
            testParticipants[i] = TournamentsStorage.Participant({
                uniqueId: userId,
                userAlias: string.concat("Alias", (i + 1).toString()),
                character: string.concat("Char", (i + 1).toString())
            });
        }
    }

    function test_Fail_IfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownership Assertion: Caller of the function is not the owner.");
        tournamentsStorage.joinTournament("any-id", TournamentsStorage.gameType.CLASSIC, testParticipants);
    }

    function test_InitialState() public view {
        assertEq(tournamentsStorage.MAX_PARTICIPANTS(), 8);
        assertEq(tournamentsStorage.getAllClassicTournamentsUUIDs().length, 0);
        assertEq(tournamentsStorage.getAllCrazyTournamentsUUIDs().length, 0);
    }

    function test_JoinTournament() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);

        TournamentsStorage.Participant[TEST_MAX_PARTICIPANTS] memory participants =
            tournamentsStorage.getParticipants(testTournamentId);
        TournamentsStorage.Participant[TEST_MAX_PARTICIPANTS * 2 - 1] memory matchedParticipants =
            tournamentsStorage.getMatchedParticipants(testTournamentId);

        assertEq(participants.length, TEST_MAX_PARTICIPANTS, "Participants array should have 8 members");
        assertEq(
            matchedParticipants.length,
            TEST_MAX_PARTICIPANTS * 2 - 1,
            "Matched participants array should have 15 members"
        );

        for (uint256 i = 0; i < TEST_MAX_PARTICIPANTS; i++) {
            assertEq(participants[i].uniqueId, testParticipants[i].uniqueId);
            assertEq(matchedParticipants[i].uniqueId, testParticipants[i].uniqueId);
        }
    }

    function test_SaveScore() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.saveScore(testTournamentId, "user1", 3, "user2", 1);

        uint256[(TEST_MAX_PARTICIPANTS - 1) * 2] memory scores = tournamentsStorage.getScores(testTournamentId);
        assertEq(scores[0], 3, "Player one's score should be 3");
        assertEq(scores[1], 1, "Player two's score should be 1");
    }

    function test_AddWinner() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.addWinner(testTournamentId, testParticipants[0]);

        TournamentsStorage.Participant[TEST_MAX_PARTICIPANTS * 2 - 1] memory matchedParticipants =
            tournamentsStorage.getMatchedParticipants(testTournamentId);
        assertEq(matchedParticipants[TEST_MAX_PARTICIPANTS].uniqueId, "user1", "Winner was not added to the next round");
    }

    function test_SaveScoreAndAddWinner() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        TournamentsStorage.Participant memory player1 = testParticipants[0];
        TournamentsStorage.Participant memory player2 = testParticipants[1];

        tournamentsStorage.saveScoreAndAddWinner(testTournamentId, player1, 5, player2, 2);

        uint256[(TEST_MAX_PARTICIPANTS - 1) * 2] memory scores = tournamentsStorage.getScores(testTournamentId);
        assertEq(scores[0], 5, "Player one's score should be 5");
        assertEq(scores[1], 2, "Player two's score should be 2");

        TournamentsStorage.Participant[TEST_MAX_PARTICIPANTS * 2 - 1] memory matchedParticipants =
            tournamentsStorage.getMatchedParticipants(testTournamentId);
        assertEq(matchedParticipants[TEST_MAX_PARTICIPANTS].uniqueId, "user1", "Winner was not correctly added");

        tournamentsStorage.saveScoreAndAddWinner(testTournamentId, player1, 2, player2, 5);

        matchedParticipants = tournamentsStorage.getMatchedParticipants(testTournamentId);
        assertEq(
            matchedParticipants[TEST_MAX_PARTICIPANTS].uniqueId,
            "user2",
            "Winner was not correctly added when player 2 wins"
        );
    }

    function test_FindLastIndexOfPlayer() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        assertEq(tournamentsStorage.findLastIndexOfPlayer(testTournamentId, "user1"), 0);
        tournamentsStorage.addWinner(testTournamentId, testParticipants[0]);
        assertEq(tournamentsStorage.findLastIndexOfPlayer(testTournamentId, "user1"), TEST_MAX_PARTICIPANTS);
    }

    function test_Fail_FindLastIndexOfPlayer_NotFound() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        vm.expectRevert("Player not found");
        tournamentsStorage.findLastIndexOfPlayer(testTournamentId, "non-existent-user");
    }

    function test_GetPlayerTournamentScores() public {
        tournamentsStorage.joinTournament(testTournamentId, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.saveScore(testTournamentId, "user1", 3, "user2", 1);
        tournamentsStorage.addWinner(testTournamentId, testParticipants[0]); // user1 wins

        string[4] memory data = tournamentsStorage.getPlayerTournamentScores(testTournamentId, "user1");
        assertEq(data[0], "Alias1", "Alias should be correct");
        assertEq(data[1], "3", "First score should be 3");

        assertEq(data[2], "0", "Second score should be 0 if not played yet");
        assertEq(keccak256(abi.encodePacked(data[3])), keccak256(abi.encodePacked("")), "Third score should be empty");
    }

    function test_GetLastThreeTournamentsPosition() public {
        string memory t1Id = "t1";
        tournamentsStorage.joinTournament(t1Id, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.addWinner(t1Id, testParticipants[0]);
        tournamentsStorage.addWinner(t1Id, testParticipants[2]);
        tournamentsStorage.addWinner(t1Id, testParticipants[4]);
        tournamentsStorage.addWinner(t1Id, testParticipants[6]);
        tournamentsStorage.addWinner(t1Id, testParticipants[0]);
        tournamentsStorage.addWinner(t1Id, testParticipants[4]);
        tournamentsStorage.addWinner(t1Id, testParticipants[0]);

        string memory t2Id = "t2";
        tournamentsStorage.joinTournament(t2Id, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.addWinner(t2Id, testParticipants[0]);
        tournamentsStorage.addWinner(t2Id, testParticipants[2]);
        tournamentsStorage.addWinner(t2Id, testParticipants[4]);
        tournamentsStorage.addWinner(t2Id, testParticipants[6]);
        tournamentsStorage.addWinner(t2Id, testParticipants[0]);
        tournamentsStorage.addWinner(t2Id, testParticipants[4]);
        tournamentsStorage.addWinner(t2Id, testParticipants[4]);

        string memory t3Id = "t3";
        tournamentsStorage.joinTournament(t3Id, TournamentsStorage.gameType.CLASSIC, testParticipants);
        tournamentsStorage.addWinner(t3Id, testParticipants[0]);
        tournamentsStorage.addWinner(t3Id, testParticipants[2]);
        tournamentsStorage.addWinner(t3Id, testParticipants[4]);
        tournamentsStorage.addWinner(t3Id, testParticipants[6]);
        tournamentsStorage.addWinner(t3Id, testParticipants[2]);
        tournamentsStorage.addWinner(t3Id, testParticipants[4]);

        string[] memory tournamentIds = new string[](3);
        tournamentIds[0] = t1Id;
        tournamentIds[1] = t2Id;
        tournamentIds[2] = t3Id;
        string[3] memory placements = tournamentsStorage.getLastThreeTournamentsPosition("user1", tournamentIds);

        assertEq(placements[0], "Tournament Winner!");
        assertEq(placements[1], "Final");
        assertEq(placements[2], "Semi-final");
    }
}
