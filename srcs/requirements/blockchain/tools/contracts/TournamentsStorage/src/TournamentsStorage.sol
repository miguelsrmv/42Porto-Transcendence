// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TournamentsStorage {
    uint8 constant MAX_PARTICIPANTS = 4;

    struct Tournament {
        uint256 id;
        uint32 date;
        uint16 time;
        uint8 maxParticipants;
        string[MAX_PARTICIPANTS] participants;
        string[(MAX_PARTICIPANTS - 1) * 2] matchedParticipants;
        uint8[(MAX_PARTICIPANTS - 1) * 2] scores;
    }

    Tournament[] public tournaments;

    function getTournaments() public view returns (Tournament[] memory) {
        return tournaments;
    }

    function getTournament(
        uint256 _id
    ) public view returns (Tournament memory) {
        return tournaments[_id];
    }

    function getParticipants(
        uint256 _id
    ) public view returns (string[MAX_PARTICIPANTS] memory) {
        return tournaments[_id].participants;
    }

    function getMatchedParticipants(
        uint256 _id
    ) public view returns (string[(MAX_PARTICIPANTS - 1) * 2] memory) {
        return tournaments[_id].matchedParticipants;
    }

    function getScores(
        uint256 _id
    ) public view returns (uint8[(MAX_PARTICIPANTS - 1) * 2] memory) {
        return tournaments[_id].scores;
    }

    function createTournament(uint32 _date, uint16 _time) public {
        string[MAX_PARTICIPANTS] memory emptyParticipants;

        for (uint8 i = 0; i < MAX_PARTICIPANTS; i++) {
            emptyParticipants[i] = "";
        }

        string[(MAX_PARTICIPANTS - 1) * 2] memory emptyMatchedParticipants;

        for (uint8 i = 0; i < (MAX_PARTICIPANTS - 1) * 2; i++) {
            emptyMatchedParticipants[i] = "";
        }

        uint8[(MAX_PARTICIPANTS - 1) * 2] memory emptyScores;

        for (uint8 i = 0; i < (MAX_PARTICIPANTS - 1) * 2; i++) {
            emptyScores[i] = 0;
        }

        tournaments.push(
            Tournament({
                id: tournaments.length,
                date: _date,
                time: _time,
                maxParticipants: MAX_PARTICIPANTS,
                participants: emptyParticipants,
                matchedParticipants: emptyMatchedParticipants,
                scores: emptyScores
            })
        );
    }

    function joinTournament(
        uint256 _tournamentId,
        string memory _participantName
    ) public {
        require(
            tournaments[_tournamentId].participants.length < MAX_PARTICIPANTS,
            "Tournament is full"
        );

        tournaments[_tournamentId].participants[
            tournaments[_tournamentId].participants.length
        ] = _participantName;
        tournaments[_tournamentId].matchedParticipants[
            tournaments[_tournamentId].matchedParticipants.length
        ] = _participantName;
    }

    function addWinner(
        uint8 _tournamentId,
        uint8 _winnerIndex,
        string memory _winnerName
    ) public {
        uint8 i = _winnerIndex;

        if (i % 2 == 1) {
            i += 1;
        }

        i /= 2;

        tournaments[_tournamentId].matchedParticipants[
            i + MAX_PARTICIPANTS
        ] = _winnerName;
    }

    function saveScore(
        uint8 _tournamentId,
        uint8 _playerOneIndex,
        uint8 _participantScoreOne,
        uint8 _playerTwoIndex,
        uint8 _participantScoreTwo
    ) public {
        tournaments[_tournamentId].scores[
            _playerOneIndex
        ] = _participantScoreOne;
        tournaments[_tournamentId].scores[
            _playerTwoIndex
        ] = _participantScoreTwo;
    }
}
