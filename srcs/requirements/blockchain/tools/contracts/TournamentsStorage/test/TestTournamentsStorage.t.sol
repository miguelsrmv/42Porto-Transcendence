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

    function testMaxParticipants() public view {
        assertEq(tournamentsStorage.MAX_PARTICIPANTS(), 4);
    }

    function testCreateTournament() public view{
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
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
        }
        string[4] memory joinedParticipants = tournamentsStorage
            .getParticipants(0);
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            assertEq(joinedParticipants[i], participants[i]);
        }
        tournamentsStorage.joinTournament(0, "Eve");
        assertEq(tournamentsStorage.getParticipants(1)[0], "Eve");
    }

    function testAddWinner() public {
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
        tournamentsStorage.addWinner(0, participants[alice]);
        assertEq(
            tournamentsStorage.getMatchedParticipants(0)[6],
            participants[alice]
        );
        vm.expectRevert();
        tournamentsStorage.addWinner(0, participants[alice]);
    }

    function testAddScore() public {
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

    function testIsTournamentFull() public {
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
            if (i != tournamentsStorage.MAX_PARTICIPANTS() - 1) {
                assertFalse(tournamentsStorage.isTournamentFull(0));
            }
        }
        assertTrue(tournamentsStorage.isTournamentFull(0));
    }

    function testFindLastIndexOfPlayer() public {
        string[4] memory participants = ["Alice", "Bob", "Charlie", "Dave"];
        for (uint8 i = 0; i < tournamentsStorage.MAX_PARTICIPANTS(); i++) {
            tournamentsStorage.joinTournament(0, participants[i]);
        }
        uint8 alice = 0;
        uint8 bob = 1;
        uint8 charlie = 2;
        uint8 dave = 3;

        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[alice]),
            0
        );
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[bob]),
            1
        );
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[charlie]),
            2
        );
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[dave]),
            3
        );
        tournamentsStorage.addWinner(0, participants[dave]);
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[dave]),
            5
        );
        tournamentsStorage.addWinner(0, participants[bob]);
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[bob]),
            4
        );
        tournamentsStorage.addWinner(0, participants[dave]);
        assertEq(
            tournamentsStorage.findLastIndexOfPlayer(0, participants[dave]),
            6
        );
    }
}
