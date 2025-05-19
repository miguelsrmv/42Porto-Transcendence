// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {console} from "forge-std/Script.sol";

contract TournamentsStorage {
    address private immutable i_owner;

    uint8 public constant MAX_PARTICIPANTS = 8; // Must be power of 2

    enum gameType {
        CLASSIC,
        CRAZY
    }

    struct Participant {
        string uniqueId;
        string userAlias;
        string character;
    }

    struct Tournament {
        uint256 id;
        uint16[3] date;
        uint8[3] time;
        uint8 maxParticipants;
        Participant[MAX_PARTICIPANTS] participants;
        Participant[MAX_PARTICIPANTS * 2 - 1] matchedParticipants;
        uint8[(MAX_PARTICIPANTS - 1) * 2] scores;
    }

    Tournament[] public classicTournaments;
    Tournament[] public crazyTournaments;

    // CONSTRUCTOR **************************************************************
    constructor() {
        createTournament(gameType.CLASSIC);
        createTournament(gameType.CRAZY);
        i_owner = msg.sender;
    }

    // MODIFIERS ****************************************************************

    modifier onlyOwner() {
        require(i_owner == msg.sender, "Ownership Assertion: Caller of the function is not the owner.");
        _;
    }

    // GETTER FUNCTIONS *********************************************************
    function getAllTournaments(gameType _gameType) public view returns (Tournament[] memory) {
        if (_gameType == gameType.CLASSIC) {
            return classicTournaments;
        }
        return crazyTournaments;
    }

    function getTournament(uint256 _id, gameType _gameType) public view returns (Tournament memory) {
        if (_gameType == gameType.CLASSIC) {
            return classicTournaments[_id];
        }
        return crazyTournaments[_id];
    }

    function getParticipants(uint256 _id, gameType _gameType)
        public
        view
        returns (Participant[MAX_PARTICIPANTS] memory)
    {
        if (_gameType == gameType.CLASSIC) {
            return classicTournaments[_id].participants;
        }
        return crazyTournaments[_id].participants;
    }

    function getMatchedParticipants(uint256 _id, gameType _gameType)
        public
        view
        returns (Participant[MAX_PARTICIPANTS * 2 - 1] memory)
    {
        if (_gameType == gameType.CLASSIC) {
            return classicTournaments[_id].matchedParticipants;
        }
        return crazyTournaments[_id].matchedParticipants;
    }

    function getScores(uint256 _id, gameType _gameType)
        public
        view
        returns (uint8[(MAX_PARTICIPANTS - 1) * 2] memory)
    {
        if (_gameType == gameType.CLASSIC) {
            return classicTournaments[_id].scores;
        }
        return crazyTournaments[_id].scores;
    }

    function getNumberOfTournamentsParticipatedByPlayer(string memory _playerName, gameType _gameType)
        public
        view
        returns (uint256)
    {
        uint256 tournamentsParticipated = 0;
        uint256 tournamentLength = 0;
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournamentLength = classicTournaments.length;
            tournaments = classicTournaments;
        } else {
            tournamentLength = crazyTournaments.length;
            tournaments = crazyTournaments;
        }

        for (uint8 i = 0; i < tournamentLength; i++) {
            for (uint8 j = 0; j < MAX_PARTICIPANTS; j++) {
                if (
                    keccak256(abi.encodePacked(tournaments[i].matchedParticipants[j].uniqueId))
                        == keccak256(abi.encodePacked(_playerName))
                ) {
                    tournamentsParticipated++;
                    break;
                }
            }
        }

        return tournamentsParticipated;
    }

    function getTournamentsWonByPlayer(string memory _playerName, gameType _gameType) public view returns (uint256) {
        uint256 tournamentsWon = 0;
        uint256 tournamentLength = 0;
        Tournament[] storage tournaments;
        uint256 winnersIndex = (MAX_PARTICIPANTS - 1) * 2;

        if (_gameType == gameType.CLASSIC) {
            tournamentLength = classicTournaments.length;
            tournaments = classicTournaments;
        } else {
            tournamentLength = crazyTournaments.length;
            tournaments = crazyTournaments;
        }

        for (uint8 i = 0; i < tournamentLength; i++) {
            if (
                keccak256(abi.encodePacked(tournaments[i].matchedParticipants[winnersIndex].uniqueId))
                    == keccak256(abi.encodePacked(_playerName))
            ) {
                tournamentsWon++;
            }
        }

        return tournamentsWon;
    }

    // ACTION FUNCTIONS *********************************************************

    function createTournament(gameType _gameType) public {
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        tournaments.push();
        Tournament storage newTournament = tournaments[tournaments.length - 1];

        newTournament.id = tournaments.length - 1;
        newTournament.date = getCurrentDate();
        newTournament.time = getCurrentTime();
        newTournament.maxParticipants = MAX_PARTICIPANTS;

        for (uint8 i = 0; i < MAX_PARTICIPANTS; i++) {
            newTournament.participants[i].uniqueId = "";
            newTournament.participants[i].userAlias = "";
            newTournament.participants[i].character = "";
        }

        for (uint8 i = 0; i < MAX_PARTICIPANTS * 2 - 1; i++) {
            newTournament.matchedParticipants[i].uniqueId = "";
            newTournament.matchedParticipants[i].userAlias = "";
            newTournament.matchedParticipants[i].character = "";
        }

        for (uint8 i = 0; i < (MAX_PARTICIPANTS - 1) * 2; i++) {
            newTournament.scores[i] = 0;
        }
    }

    // function joinTournament(uint256 _tournamentId, Participant memory _participant) public onlyOwner {
    //     uint8 tournamentLength = 0;

    //     if (isTournamentFull(_tournamentId)) {
    //         createTournament();
    //         _tournamentId++;
    //     }

    //     while (
    //         keccak256(abi.encodePacked(tournaments[_tournamentId].participants[tournamentLength].uniqueId))
    //             != keccak256(abi.encodePacked(""))
    //     ) {
    //         require(
    //             keccak256(abi.encodePacked(tournaments[_tournamentId].participants[tournamentLength].uniqueId))
    //                 != keccak256(abi.encodePacked(_participant.uniqueId)),
    //             "The player is already registered in the tournament"
    //         );
    //         tournamentLength++;
    //     }

    //     tournaments[_tournamentId].participants[tournamentLength].uniqueId = _participant.uniqueId;
    //     tournaments[_tournamentId].participants[tournamentLength].userAlias = _participant.userAlias;
    //     tournaments[_tournamentId].participants[tournamentLength].character = _participant.character;

    //     tournaments[_tournamentId].matchedParticipants[tournamentLength].uniqueId = _participant.uniqueId;
    //     tournaments[_tournamentId].matchedParticipants[tournamentLength].userAlias = _participant.userAlias;
    //     tournaments[_tournamentId].matchedParticipants[tournamentLength].character = _participant.character;

    //     console.log(_participant.uniqueId, "joined tournament", _tournamentId);
    // }

    function joinTournament(uint256 _tournamentId, gameType _gameType, Participant[] memory _participants)
        public
        onlyOwner
    {
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        if (isTournamentFull(_tournamentId, _gameType)) {
            createTournament(_gameType);
            _tournamentId++;
        }

        for (uint8 i = 0; i < _participants.length; i++) {
            tournaments[_tournamentId].participants[i].uniqueId = _participants[i].uniqueId;
            tournaments[_tournamentId].participants[i].userAlias = _participants[i].userAlias;
            tournaments[_tournamentId].participants[i].character = _participants[i].character;

            tournaments[_tournamentId].matchedParticipants[i].uniqueId = _participants[i].uniqueId;
            tournaments[_tournamentId].matchedParticipants[i].userAlias = _participants[i].userAlias;
            tournaments[_tournamentId].matchedParticipants[i].character = _participants[i].character;

            console.log(_participants[i].uniqueId, "joined tournament", _tournamentId);
        }
    }

    function addWinner(uint8 _tournamentId, gameType _gameType, string memory _winnerName) public onlyOwner {
        uint8 winnerNextIndex = findLastIndexOfPlayer(_tournamentId, _gameType, _winnerName) / 2 + MAX_PARTICIPANTS;
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        tournaments[_tournamentId].matchedParticipants[winnerNextIndex].uniqueId = _winnerName;
        console.log("Added winner", _winnerName, "to tournament", _tournamentId);
    }

    function saveScore(
        uint8 _tournamentId,
        gameType _gameType,
        string memory _playerOneName,
        uint8 _playerOneScore,
        string memory _playerTwoName,
        uint8 _playerTwoScore
    ) public onlyOwner {
        uint8 updatedPlayerOneIndex = findLastIndexOfPlayer(_tournamentId, _gameType, _playerOneName);
        uint8 updatedPlayerTwoIndex = findLastIndexOfPlayer(_tournamentId, _gameType, _playerTwoName);
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        tournaments[_tournamentId].scores[updatedPlayerOneIndex] = _playerOneScore;
        tournaments[_tournamentId].scores[updatedPlayerTwoIndex] = _playerTwoScore;
        console.log("Scores saved for Tournament:", _tournamentId);
        console.log("Player One:", _playerOneName);
        console.logUint(_playerOneScore);
        console.log("Player Two:", _playerTwoName);
        console.logUint(_playerTwoScore);
    }

    function saveScoreAndAddWinner(
        uint8 _tournamentId,
        gameType _gameType,
        string memory _playerOneName,
        uint8 _playerOneScore,
        string memory _playerTwoName,
        uint8 _playerTwoScore
    ) public onlyOwner {
        saveScore(_tournamentId, _gameType, _playerOneName, _playerOneScore, _playerTwoName, _playerTwoScore);

        if (_playerOneScore > _playerTwoScore) {
            addWinner(_tournamentId, _gameType, _playerOneName);
        } else {
            addWinner(_tournamentId, _gameType, _playerTwoName);
        }
    }

    //HELPER FUNCTIONS **********************************************************
    /* Check if a tournament is full */
    function isTournamentFull(uint256 _tournamentId, gameType _gameType) public view returns (bool) {
        uint8 tournamentLength = 0;
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        while (
            tournamentLength < MAX_PARTICIPANTS
                && keccak256(abi.encodePacked(tournaments[_tournamentId].participants[tournamentLength].uniqueId))
                    != keccak256(abi.encodePacked(""))
        ) tournamentLength++;

        return tournamentLength >= MAX_PARTICIPANTS;
    }

    /* Find last index of a player in a tournament */
    function isEmptyString(string memory str) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str)) == keccak256(abi.encodePacked(""));
    }

    function findLastIndexOfPlayer(uint8 _tournamentId, gameType _gameType, string memory _playerName)
        public
        view
        returns (uint8)
    {
        uint8 lastIndex = 0;
        uint8 tournamentLength = MAX_PARTICIPANTS * 2 - 1;
        Tournament[] storage tournaments;

        if (_gameType == gameType.CLASSIC) {
            tournaments = classicTournaments;
        } else {
            tournaments = crazyTournaments;
        }

        for (uint8 i = 0; i < tournamentLength; i++) {
            if (
                keccak256(abi.encodePacked(tournaments[_tournamentId].matchedParticipants[i].uniqueId))
                    == keccak256(abi.encodePacked(_playerName))
            ) {
                lastIndex = i;
            }
        }

        require(
            keccak256(abi.encodePacked(tournaments[_tournamentId].matchedParticipants[lastIndex].uniqueId))
                == keccak256(abi.encodePacked(_playerName)),
            "Player not found"
        );

        return lastIndex;
    }

    /* Get the current timestamp */
    function getCurrentTimestamp() internal view returns (uint256) {
        return block.timestamp; // Avalanche timestamp in UTC
    }

    function _daysToDate(uint256 _days) internal pure returns (uint256 year, uint256 month, uint256 day) {
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
        returns (uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)
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
        (uint256 year, uint256 month, uint256 day,,,) = getCurrentDateTimeUTC();

        date[0] = uint16(day);
        date[1] = uint16(month);
        date[2] = uint16(year);

        return date;
    }

    function getCurrentTime() internal view returns (uint8[3] memory time) {
        (,,, uint256 hour, uint256 minute, uint256 second) = getCurrentDateTimeUTC();

        time[0] = uint8(hour);
        time[1] = uint8(minute);
        time[2] = uint8(second);

        return time;
    }
}
