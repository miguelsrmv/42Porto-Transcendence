// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TournamentsStorage {
    uint8 constant MAX_PARTICIPANTS = 4;

    struct Tournament {
        uint256 id;
        uint16[3] date;
        uint8[3] time;
        uint8 maxParticipants;
        string[MAX_PARTICIPANTS] participants;
        string[MAX_PARTICIPANTS * 2 - 1] matchedParticipants;
        uint8[(MAX_PARTICIPANTS - 1) * 2] scores;
    }

    Tournament[] public tournaments;

    // GETTER FUNCTIONS *********************************************************
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
    ) public view returns (string[MAX_PARTICIPANTS * 2 - 1] memory) {
        return tournaments[_id].matchedParticipants;
    }

    function getScores(
        uint256 _id
    ) public view returns (uint8[(MAX_PARTICIPANTS - 1) * 2] memory) {
        return tournaments[_id].scores;
    }

    // ERROR CHECKER FUNCTIONS **************************************************
    function isTournamentFull(uint256 _tournamentId) internal view {
        uint8 tournamentLength = 0;

        while (
            keccak256(
                abi.encodePacked(
                    tournaments[_tournamentId].participants[tournamentLength]
                )
            ) != keccak256(abi.encodePacked(""))
        ) tournamentLength++;

        require(tournamentLength < MAX_PARTICIPANTS, "Tournament is full");
    }

    // ACTION FUNCTIONS *********************************************************
    function createTournament() public {
        string[MAX_PARTICIPANTS] memory emptyParticipants;
        for (uint8 i = 0; i < MAX_PARTICIPANTS; i++) {
            emptyParticipants[i] = "";
        }

        string[MAX_PARTICIPANTS * 2 - 1] memory emptyMatchedParticipants;
        for (uint8 i = 0; i < MAX_PARTICIPANTS * 2 - 1; i++) {
            emptyMatchedParticipants[i] = "";
        }

        uint8[(MAX_PARTICIPANTS - 1) * 2] memory emptyScores;
        for (uint8 i = 0; i < (MAX_PARTICIPANTS - 1) * 2; i++) {
            emptyScores[i] = 0;
        }

        tournaments.push(
            Tournament({
                id: tournaments.length,
                date: getCurrentDate(),
                time: getCurrentTime(),
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
        uint8 tournamentLength = 0;

        while (
            keccak256(
                abi.encodePacked(
                    tournaments[_tournamentId].participants[tournamentLength]
                )
            ) != keccak256(abi.encodePacked(""))
        ) tournamentLength++;

        require(tournamentLength < MAX_PARTICIPANTS, "Tournament is full");

        tournaments[_tournamentId].participants[
            tournamentLength
        ] = _participantName;
        tournaments[_tournamentId].matchedParticipants[
            tournamentLength
        ] = _participantName;
    }

    function addWinner(uint8 _tournamentId, string memory _winnerName) public {
        uint8 winnerNextIndex = findLastIndexOfPlayer(
            _tournamentId,
            _winnerName
        ) /
            2 +
            MAX_PARTICIPANTS;

        tournaments[_tournamentId].matchedParticipants[
            winnerNextIndex
        ] = _winnerName;
    }

    function saveScore(
        uint8 _tournamentId,
        string memory _playerOneName,
        uint8 _playerOneScore,
        string memory _playerTwoName,
        uint8 _playerTwoScore
    ) public {
        uint8 updatedPlayerOneIndex = findLastIndexOfPlayer(
            _tournamentId,
            _playerOneName
        );

        uint8 updatedPlayerTwoIndex = findLastIndexOfPlayer(
            _tournamentId,
            _playerTwoName
        );

        tournaments[_tournamentId].scores[
            updatedPlayerOneIndex
        ] = _playerOneScore;
        tournaments[_tournamentId].scores[
            updatedPlayerTwoIndex
        ] = _playerTwoScore;
    }

    //HELPER FUNCTIONS **********************************************************
    /* Find last index of a player in the tournament */
    function isEmptyString(string memory str) internal pure returns (bool) {
        return
            keccak256(abi.encodePacked(str)) == keccak256(abi.encodePacked(""));
    }

    function findLastIndexOfPlayer(
        uint8 _tournamentId,
        string memory _playerName
    ) internal view returns (uint8) {
        uint8 lastIndex = 0;
        uint8 tournamentLength = 0;

        while (
            tournamentLength < (MAX_PARTICIPANTS - 1) * 2 &&
            !isEmptyString(
                tournaments[_tournamentId].matchedParticipants[tournamentLength]
            )
        ) tournamentLength++;

        for (uint8 i = 0; i < tournamentLength; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        tournaments[_tournamentId].matchedParticipants[i]
                    )
                ) == keccak256(abi.encodePacked(_playerName))
            ) {
                lastIndex = i;
            }
        }

        require(
            keccak256(
                abi.encodePacked(
                    tournaments[_tournamentId].matchedParticipants[lastIndex]
                )
            ) == keccak256(abi.encodePacked(_playerName)),
            "Player not found"
        );

        return lastIndex;
    }

    /* Get the current timestamp */
    function getCurrentTimestamp() internal view returns (uint256) {
        return block.timestamp; // Avalanche timestamp in UTC
    }

    function _daysToDate(
        uint256 _days
    ) internal pure returns (uint256 year, uint256 month, uint256 day) {
        int256 OFFSET19700101 = 2440588;
        int256 L = int256(_days) + 68569 + OFFSET19700101;
        int256 N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int256 _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int256 _month = (80 * L) / 2447;
        int256 _day = L - (2447 * _month) / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        return (uint256(_year), uint256(_month), uint256(_day));
    }

    function getCurrentDateTimeUTC()
        internal
        view
        returns (
            uint256 year,
            uint256 month,
            uint256 day,
            uint256 hour,
            uint256 minute,
            uint256 second
        )
    {
        uint256 timestamp = block.timestamp;
        uint256 SECONDS_PER_DAY = 86400;
        uint256 SECONDS_PER_HOUR = 3600;
        uint256 SECONDS_PER_MINUTE = 60;

        uint256 daysSinceEpoch = timestamp / SECONDS_PER_DAY;
        uint256 secondsInDay = timestamp % SECONDS_PER_DAY;

        hour = secondsInDay / SECONDS_PER_HOUR;
        minute = (secondsInDay % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE;
        second = (secondsInDay % SECONDS_PER_HOUR) % SECONDS_PER_MINUTE;

        (year, month, day) = _daysToDate(daysSinceEpoch);

        return (year, month, day, hour, minute, second);
    }

    function getCurrentDate() internal view returns (uint16[3] memory date) {
        (
            uint256 year,
            uint256 month,
            uint256 day,
            ,
            ,

        ) = getCurrentDateTimeUTC();

        date[0] = uint16(day);
        date[1] = uint16(month);
        date[2] = uint16(year);

        return date;
    }

    function getCurrentTime() internal view returns (uint8[3] memory time) {
        (
            ,
            ,
            ,
            uint256 hour,
            uint256 minute,
            uint256 second
        ) = getCurrentDateTimeUTC();

        time[0] = uint8(hour);
        time[1] = uint8(minute);
        time[2] = uint8(second);

        return time;
    }
}
