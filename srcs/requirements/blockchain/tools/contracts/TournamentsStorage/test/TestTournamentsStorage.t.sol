// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {TournamentsStorage} from "../src/TournamentsStorage.sol";

contract TournamentsStorageTest is Test {
    TournamentsStorage tournamentsStorage;

    function setUp() external {
        tournamentsStorage = new TournamentsStorage();
    }

    function testMaxParticipants() public view {
        assertEq(tournamentsStorage.MAX_PARTICIPANTS(), 4);
    }

    function testCreateTournament() public {
        tournamentsStorage.createTournament();
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
        tournamentsStorage.createTournament();
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
        }
        string[4] memory joinedParticipants = tournamentsStorage
            .getParticipants(0);
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            assertEq(joinedParticipants[i], participants[i]);
        }
    }

    function testAddWinner() public {
        tournamentsStorage.createTournament();
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
        }
        uint8 charlie = 2;
        uint8 alice = 0;
        tournamentsStorage.addWinner(0, participants[charlie]);
        assertEq(
            tournamentsStorage.getMatchedParticipants(0)[5],
            participants[charlie]
        );
        tournamentsStorage.addWinner(0, participants[alice]);
        assertEq(
            tournamentsStorage.getMatchedParticipants(0)[4],
            participants[alice]
        );
    }

    function testAddScore() public {
        tournamentsStorage.createTournament();
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
        }
        tournamentsStorage.saveScore(0, "Charlie", 3, "Dave", 4);
        tournamentsStorage.addWinner(0, "Dave");
        tournamentsStorage.saveScore(0, "Alice", 1, "Bob", 2);
        tournamentsStorage.addWinner(0, "Bob");
        tournamentsStorage.saveScore(0, "Bob", 5, "Dave", 6);
        tournamentsStorage.addWinner(0, "Dave");
        assertEq(tournamentsStorage.getScores(0)[0], 1);
        assertEq(tournamentsStorage.getScores(0)[1], 2);
        assertEq(tournamentsStorage.getScores(0)[2], 3);
        assertEq(tournamentsStorage.getScores(0)[3], 4);
        assertEq(tournamentsStorage.getScores(0)[4], 5);
        assertEq(tournamentsStorage.getScores(0)[5], 6);
    }
}
