// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract TournamentsStorage {
    struct Tournament {
        uint256 id;
        string name;
        uint256 date;
        uint256 time;
        uint256 maxParticipants;
        uint256[] participants;
    }

    Tournament[] public tournaments;

    uint8 constant MAX_PARTICIPANTS = 4;

    function createTournament(
        string memory _name,
        uint256 _date,
        uint256 _time
    ) public {
        tournaments.push(
            Tournament({
                id: tournaments.length,
                name: _name,
                date: _date,
                time: _time,
                maxParticipants: MAX_PARTICIPANTS,
                participants: new uint256[](0)
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

    function joinTournament(uint256 _id) public {
        tournaments[_id].participants.push(1);
    }

    function getParticipants(
        uint256 _id
    ) public view returns (uint256[] memory) {
        return tournaments[_id].participants;
    }
}
