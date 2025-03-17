// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract TournamentsStorage {
    uint8 constant MAX_PARTICIPANTS = 4;

    struct Tournament {
        uint256 id;
        string name;
        uint32 date;
        uint16 time;
        uint8 maxParticipants;
        string[] participants;
        uint8[] scores;
    }

    Tournament[] public tournaments;

    function createTournament(
        string memory _name,
        uint32 _date,
        uint16 _time
    ) public {
        tournaments.push(
            Tournament({
                id: tournaments.length,
                name: _name,
                date: _date,
                time: _time,
                maxParticipants: MAX_PARTICIPANTS,
                participants: new string[](0),
                scores: new uint8[](0)
            })
        );
    }

    function getTournaments() public view returns (Tournament[] memory) {
        return tournaments;
    }

    function getTournament(
        uint256 _id
    ) public view returns (Tournament memory) {
        return tournaments[_id];
    }

    function joinTournament(
        uint256 _id,
        string memory _participantName
    ) public {
        require(
            tournaments[_id].participants.length < MAX_PARTICIPANTS,
            "Tournament is full"
        );

        tournaments[_id].participants.push(_participantName);
    }

    function getParticipants(
        uint256 _id
    ) public view returns (string[] memory) {
        return tournaments[_id].participants;
    }
}
