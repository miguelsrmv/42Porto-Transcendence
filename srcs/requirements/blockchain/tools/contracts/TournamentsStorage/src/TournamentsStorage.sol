// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {console} from "forge-std/Script.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

contract TournamentsStorage {
    address private immutable i_owner;
    uint256 public constant MAX_PARTICIPANTS = 8; // Must be power of 2

    using Strings for uint256;

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
        gameType typeOfGame;
        uint16[3] date;
        uint256[3] time;
        uint256 maxParticipants;
        Participant[MAX_PARTICIPANTS] participants;
        Participant[MAX_PARTICIPANTS * 2 - 1] matchedParticipants;
        uint256[(MAX_PARTICIPANTS - 1) * 2] scores;
    }

    struct TournamentIdAndType {
        string id;
        gameType typeOfGame;
    }

    mapping(string => Tournament) private tournamentsMap;

    string[] classicTournamentsUUID;
    string[] crazyTournamentsUUID;

    // CONSTRUCTOR***************************************************************
    constructor() {
        i_owner = msg.sender;
    }

    // MODIFIERS ****************************************************************
    modifier onlyOwner() {
        require(i_owner == msg.sender, "Ownership Assertion: Caller of the function is not the owner.");
        _;
    }

    // GETTER FUNCTIONS *********************************************************
    function getTournament(string memory _tournamentId) public view returns (Tournament memory) {
        return tournamentsMap[_tournamentId];
    }

    function getParticipants(string memory _tournamentId) public view returns (Participant[MAX_PARTICIPANTS] memory) {
        return tournamentsMap[_tournamentId].participants;
    }

    function getMatchedParticipants(string memory _tournamentId)
        public
        view
        returns (Participant[MAX_PARTICIPANTS * 2 - 1] memory)
    {
        return tournamentsMap[_tournamentId].matchedParticipants;
    }

    function getScores(string memory _tournamentId) public view returns (uint256[(MAX_PARTICIPANTS - 1) * 2] memory) {
        return tournamentsMap[_tournamentId].scores;
    }

    // ACTION FUNCTIONS *********************************************************
    function createTournament(string memory _tournamentId, gameType _gameType) public {
        Tournament memory newTournament;

        newTournament.typeOfGame = _gameType;
        newTournament.date = getCurrentDate();
        newTournament.time = getCurrentTime();
        newTournament.maxParticipants = MAX_PARTICIPANTS;

        for (uint256 i = 0; i < MAX_PARTICIPANTS; i++) {
            newTournament.participants[i].uniqueId = "";
            newTournament.participants[i].userAlias = "";
            newTournament.participants[i].character = "";
        }

        for (uint256 i = 0; i < MAX_PARTICIPANTS * 2 - 1; i++) {
            newTournament.matchedParticipants[i].uniqueId = "";
            newTournament.matchedParticipants[i].userAlias = "";
            newTournament.matchedParticipants[i].character = "";
        }

        for (uint256 i = 0; i < (MAX_PARTICIPANTS - 1) * 2; i++) {
            newTournament.scores[i] = 0;
        }

        tournamentsMap[_tournamentId] = newTournament;

        if (_gameType == gameType.CLASSIC) {
            classicTournamentsUUID.push(_tournamentId);
        } else {
            crazyTournamentsUUID.push(_tournamentId);
        }
    }

    function joinTournament(string memory _tournamentId, gameType _gameType, Participant[] memory _participants)
        public
        onlyOwner
    {
        createTournament(_tournamentId, _gameType);

        for (uint256 i = 0; i < _participants.length; i++) {
            tournamentsMap[_tournamentId].participants[i].uniqueId = _participants[i].uniqueId;
            tournamentsMap[_tournamentId].participants[i].userAlias = _participants[i].userAlias;
            tournamentsMap[_tournamentId].participants[i].character = _participants[i].character;
            tournamentsMap[_tournamentId].matchedParticipants[i].uniqueId = _participants[i].uniqueId;
            tournamentsMap[_tournamentId].matchedParticipants[i].userAlias = _participants[i].userAlias;
            tournamentsMap[_tournamentId].matchedParticipants[i].character = _participants[i].character;

            console.log(_participants[i].uniqueId, "joined tournament", _tournamentId);
        }
    }

    function addWinner(string memory _tournamentId, string memory _winnerName) public onlyOwner {
        uint256 winnerNextIndex = findLastIndexOfPlayer(_tournamentId, _winnerName) / 2 + MAX_PARTICIPANTS;

        tournamentsMap[_tournamentId].matchedParticipants[winnerNextIndex].uniqueId = _winnerName;
        console.log("Added winner", _winnerName, "to tournament", _tournamentId);
    }

    function saveScore(
        string memory _tournamentId,
        string memory _playerOneName,
        uint256 _playerOneScore,
        string memory _playerTwoName,
        uint256 _playerTwoScore
    ) public onlyOwner {
        uint256 updatedPlayerOneIndex = findLastIndexOfPlayer(_tournamentId, _playerOneName);
        uint256 updatedPlayerTwoIndex = findLastIndexOfPlayer(_tournamentId, _playerTwoName);

        tournamentsMap[_tournamentId].scores[updatedPlayerOneIndex] = _playerOneScore;
        tournamentsMap[_tournamentId].scores[updatedPlayerTwoIndex] = _playerTwoScore;
        console.log("Scores saved for Tournament:", _tournamentId);
        console.log("Player One:", _playerOneName);
        console.logUint(_playerOneScore);
        console.log("Player Two:", _playerTwoName);
        console.logUint(_playerTwoScore);
    }

    function saveScoreAndAddWinner(
        string memory _tournamentId,
        string memory _playerOneName,
        uint256 _playerOneScore,
        string memory _playerTwoName,
        uint256 _playerTwoScore
    ) public onlyOwner {
        saveScore(_tournamentId, _playerOneName, _playerOneScore, _playerTwoName, _playerTwoScore);

        if (_playerOneScore > _playerTwoScore) {
            addWinner(_tournamentId, _playerOneName);
        } else {
            addWinner(_tournamentId, _playerTwoName);
        }
    }

    //HELPER FUNCTIONS **********************************************************
    /* Find last index of a player in a tournament */
    function isEmptyString(string memory str) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str)) == keccak256(abi.encodePacked(""));
    }

    function findLastIndexOfPlayer(string memory _tournamentId, string memory _playerName)
        public
        view
        returns (uint256)
    {
        uint256 lastIndex = 0;
        uint256 tournamentLength = MAX_PARTICIPANTS * 2 - 1;

        for (uint256 i = 0; i < tournamentLength; i++) {
            if (
                keccak256(abi.encodePacked(tournamentsMap[_tournamentId].matchedParticipants[i].uniqueId))
                    == keccak256(abi.encodePacked(_playerName))
            ) {
                lastIndex = i;
            }
        }

        require(
            keccak256(abi.encodePacked(tournamentsMap[_tournamentId].matchedParticipants[lastIndex].uniqueId))
                == keccak256(abi.encodePacked(_playerName)),
            "Player not found"
        );

        return lastIndex;
    }

    function getLastThreeTournamentsPosition(string memory _userId, TournamentIdAndType[3] memory _data)
        public
        view
        returns (string[3] memory)
    {
        string[3] memory placements;

        for (uint256 i = 0; i < 3; i++) {
            uint256 lastIndex = findLastIndexOfPlayer(_data[i].id, _userId);
            uint256 maxNumberOfPlaces = (MAX_PARTICIPANTS - 1) * 2;

            if (lastIndex == maxNumberOfPlaces) {
                placements[i] = "Tournament Winner!";
            } else if (lastIndex >= maxNumberOfPlaces - 2 && lastIndex <= maxNumberOfPlaces - 1) {
                placements[i] = "Final";
            } else if (lastIndex >= maxNumberOfPlaces - 6 && lastIndex <= maxNumberOfPlaces - 3) {
                placements[i] = "Semi-final";
            } else if (lastIndex >= maxNumberOfPlaces - 14 && lastIndex <= maxNumberOfPlaces - 7) {
                placements[i] = "Quarter-final";
            } else if (maxNumberOfPlaces > 14) {
                uint256 nbrRound = MAX_PARTICIPANTS;
                uint256 tier = nbrRound;

                while (lastIndex < tier) {
                    nbrRound /= 2;
                    tier += nbrRound;
                }

                string memory strRoundName = "Round of ";
                string memory strRoundNumber = nbrRound.toString();

                placements[i] = string(abi.encodePacked(strRoundName, strRoundNumber));
            }
        }
        return placements;
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

    function getCurrentTime() internal view returns (uint256[3] memory time) {
        (,,, uint256 hour, uint256 minute, uint256 second) = getCurrentDateTimeUTC();

        time[0] = uint256(hour);
        time[1] = uint256(minute);
        time[2] = uint256(second);

        return time;
    }
}
