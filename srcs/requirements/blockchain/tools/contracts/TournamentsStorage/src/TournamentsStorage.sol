// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "openzeppelin-contracts/contracts/utils/Strings.sol";

/**
 * @title TournamentsStorage
 * @notice This contract manages the storage and logic for single-elimination tournaments.
 * @dev It handles tournament creation, participant management, score tracking, and winner progression.
 * The tournament bracket is represented by the `matchedParticipants` array, where the first
 * `MAX_PARTICIPANTS` slots are the initial players, and subsequent slots represent winners' positions.
 */
contract TournamentsStorage {
    // STATE VARIABLES **********************************************************

    /// @notice The owner of the contract, set immutably at deployment.
    address private immutable i_owner;

    /// @notice The fixed number of participants for any tournament. Must be a power of 2.
    uint256 public constant MAX_PARTICIPANTS = 8;

    /// @notice Main mapping from a unique tournament ID (UUID) to its corresponding Tournament struct.
    mapping(string => Tournament) private tournamentsMap;

    /// @notice An array of UUIDs for all tournaments of type CLASSIC.
    string[] public classicTournamentsUUID;

    /// @notice An array of UUIDs for all tournaments of type CRAZY.
    string[] public crazyTournamentsUUID;

    /// @dev Provides `.toString()` functionality for uint256.
    using Strings for uint256;

    /// @notice Defines the type of game for a tournament.
    enum gameType {
        CLASSIC,
        CRAZY
    }

    /// @notice Represents a single participant in a tournament.
    struct Participant {
        string uniqueId; // A unique identifier for the user.
        string userAlias; // The user's display name.
        string character; // The character or avatar chosen by the user.
    }

    /// @notice Represents the entire state of a single tournament.
    struct Tournament {
        gameType typeOfGame; // The type of the tournament (CLASSIC or CRAZY).
        uint16[3] date; // The creation date [day, month, year].
        uint256[3] time; // The creation time [hour, minute, second] in UTC.
        uint256 maxParticipants; // The maximum number of participants.
        Participant[MAX_PARTICIPANTS] participants; // Initial list of registered participants.
        Participant[MAX_PARTICIPANTS * 2 - 1] matchedParticipants; // The full tournament bracket.
        uint256[(MAX_PARTICIPANTS - 1) * 2] scores; // Scores for each match.
    }

    // CONSTRUCTOR***************************************************************
    /**
     * @notice Sets the contract deployer as the owner.
     */
    constructor() {
        i_owner = msg.sender;
    }

    // MODIFIERS ****************************************************************
    /**
     * @dev Throws an error if the caller of the function is not the owner.
     */
    modifier onlyOwner() {
        require(i_owner == msg.sender, "Ownership Assertion: Caller of the function is not the owner.");
        _;
    }

    // GETTER FUNCTIONS *********************************************************

    /**
     * @notice Retrieves all tournament UUIDs of the CLASSIC game type.
     * @return string[] memory An array of classic tournament UUIDs.
     */
    function getAllClassicTournamentsUUIDs() public view returns (string[] memory) {
        return classicTournamentsUUID;
    }

    /**
     * @notice Retrieves all tournament UUIDs of the CRAZY game type.
     * @return string[] memory An array of crazy tournament UUIDs.
     */
    function getAllCrazyTournamentsUUIDs() public view returns (string[] memory) {
        return crazyTournamentsUUID;
    }

    /**
     * @notice Fetches the complete Tournament struct for a given ID.
     * @param _tournamentId The unique identifier of the tournament.
     * @return Tournament memory The requested tournament's data.
     */
    function getTournament(string memory _tournamentId) public view returns (Tournament memory) {
        return tournamentsMap[_tournamentId];
    }

    /**
     * @notice Fetches the initial list of participants for a given tournament.
     * @param _tournamentId The unique identifier of the tournament.
     * @return Participant[MAX_PARTICIPANTS] memory The array of initial participants.
     */
    function getParticipants(string memory _tournamentId) public view returns (Participant[MAX_PARTICIPANTS] memory) {
        return tournamentsMap[_tournamentId].participants;
    }

    /**
     * @notice Fetches the full tournament bracket, including winners of each round.
     * @dev The array size is `MAX_PARTICIPANTS * 2 - 1`, representing all players and match slots.
     * @param _tournamentId The unique identifier of the tournament.
     * @return Participant[MAX_PARTICIPANTS * 2 - 1] memory The tournament bracket.
     */
    function getMatchedParticipants(string memory _tournamentId)
        public
        view
        returns (Participant[MAX_PARTICIPANTS * 2 - 1] memory)
    {
        return tournamentsMap[_tournamentId].matchedParticipants;
    }

    /**
     * @notice Fetches the scores for all matches in a tournament.
     * @dev The array size is `(MAX_PARTICIPANTS - 1) * 2`. It maps directly to the `matchedParticipants` array.
     * @param _tournamentId The unique identifier of the tournament.
     * @return uint256[] memory The array of scores.
     */
    function getScores(string memory _tournamentId) public view returns (uint256[(MAX_PARTICIPANTS - 1) * 2] memory) {
        return tournamentsMap[_tournamentId].scores;
    }

    /**
     * @notice Calculates a player's placement (e.g., "Final", "Semi-final") for up to three recent tournaments.
     * @dev This function determines the round a player was eliminated in based on their last position in the `matchedParticipants` array.
     * @param _userId The unique ID of the player.
     * @param _data An array of the last three tournament IDs the player participated in.
     * @return string[3] memory An array of strings describing the player's placement in each tournament.
     */
    function getLastThreeTournamentsPosition(string memory _userId, string[] memory _data)
        public
        view
        returns (string[3] memory)
    {
        string[3] memory placements;
        uint256 tournamentsToDisplay = 0;

        for (uint256 i = 0; i < 3; i++) {
            placements[i] = "";
            if (keccak256(abi.encodePacked(_data[i])) != keccak256(abi.encodePacked(""))) tournamentsToDisplay++;
        }

        for (uint256 i = 0; i < tournamentsToDisplay; i++) {
            uint256 lastIndex = findLastIndexOfPlayer(_data[i], _userId);
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

    /**
     * @notice Retrieves a player's alias and their scores from each round they played in a specific tournament.
     * @param _tournamentId The unique identifier of the tournament.
     * @param _userId The unique ID of the player.
     * @return string[4] memory An array containing the player's alias at index 0, followed by up to 3 scores.
     */
    function getPlayerTournamentScores(string memory _tournamentId, string memory _userId)
        public
        view
        returns (string[4] memory)
    {
        string[4] memory data;

        data[1] = "";
        data[2] = "";
        data[3] = "";

        Tournament memory tournament = tournamentsMap[_tournamentId];
        for (uint256 i = 0; i < MAX_PARTICIPANTS; i++) {
            if (
                keccak256(abi.encodePacked(tournament.participants[i].uniqueId)) == keccak256(abi.encodePacked(_userId))
            ) {
                data[0] = tournament.participants[i].userAlias;
                break;
            }
        }
        uint256 dataIndex = 1;
        for (uint256 i = 0; i < MAX_PARTICIPANTS * 2 - 2; i++) {
            if (
                keccak256(abi.encodePacked(tournament.matchedParticipants[i].uniqueId))
                    == keccak256(abi.encodePacked(_userId))
            ) {
                data[dataIndex] = (tournament.scores[i]).toString();
                dataIndex++;
            }
        }

        return data;
    }

    // ACTION FUNCTIONS *********************************************************
    /**
     * @notice Creates a new, empty tournament with initialized data structures.
     * @dev Can only be called by the contract owner. Automatically sets creation date and time.
     * @param _tournamentId A unique string to identify the tournament.
     * @param _gameType The type of game (CLASSIC or CRAZY).
     */
    function createTournament(string memory _tournamentId, gameType _gameType) public onlyOwner {
        Tournament storage newTournament = tournamentsMap[_tournamentId];

        newTournament.typeOfGame = _gameType;
        newTournament.date = getCurrentDate();
        newTournament.time = getCurrentTime();
        newTournament.maxParticipants = MAX_PARTICIPANTS;

        // Note: Fixed-size arrays in storage are already zeroed out,
        // explicit loops are not strictly necessary but can be left for clarity.

        if (_gameType == gameType.CLASSIC) {
            classicTournamentsUUID.push(_tournamentId);
        } else {
            crazyTournamentsUUID.push(_tournamentId);
        }
    }

    /**
     * @notice A helper function for the owner to create and immediately populate a tournament.
     * @dev This is a convenience function that calls `createTournament` and then fills the initial participant slots.
     * @param _tournamentId A unique string to identify the tournament.
     * @param _gameType The type of game (CLASSIC or CRAZY).
     * @param _participants An array of `Participant` structs to add to the tournament.
     */
    function joinTournament(string memory _tournamentId, gameType _gameType, Participant[] memory _participants)
        public
        onlyOwner
    {
        createTournament(_tournamentId, _gameType);

        for (uint256 i = 0; i < _participants.length; i++) {
            tournamentsMap[_tournamentId].participants[i] = _participants[i];
            tournamentsMap[_tournamentId].matchedParticipants[i] = _participants[i];
        }
    }

    /**
     * @notice Advances a winning player to the next round in the bracket.
     * @dev Calculates the winner's next position in the `matchedParticipants` array based on their current position.
     * @param _tournamentId The identifier of the tournament.
     * @param _winner The `Participant` struct of the winning player.
     */
    function addWinner(string memory _tournamentId, Participant memory _winner) public onlyOwner {
        uint256 winnerNextIndex = findLastIndexOfPlayer(_tournamentId, _winner.uniqueId) / 2 + MAX_PARTICIPANTS;
        tournamentsMap[_tournamentId].matchedParticipants[winnerNextIndex] = _winner;
    }

    /**
     * @notice Records the final scores for two players in a match.
     * @dev Finds each player's latest position in the bracket to store the score correctly.
     * @param _tournamentId The identifier of the tournament.
     * @param _playerOneUniqueId The unique ID of the first player.
     * @param _playerOneScore The score of the first player.
     * @param _playerTwoUniqueId The unique ID of the second player.
     * @param _playerTwoScore The score of the second player.
     */
    function saveScore(
        string memory _tournamentId,
        string memory _playerOneUniqueId,
        uint256 _playerOneScore,
        string memory _playerTwoUniqueId,
        uint256 _playerTwoScore
    ) public onlyOwner {
        uint256 updatedPlayerOneIndex = findLastIndexOfPlayer(_tournamentId, _playerOneUniqueId);
        uint256 updatedPlayerTwoIndex = findLastIndexOfPlayer(_tournamentId, _playerTwoUniqueId);

        tournamentsMap[_tournamentId].scores[updatedPlayerOneIndex] = _playerOneScore;
        tournamentsMap[_tournamentId].scores[updatedPlayerTwoIndex] = _playerTwoScore;
    }

    /**
     * @notice A combined function to save match scores and advance the winner.
     * @dev Calls `saveScore` and then determines the winner based on scores to call `addWinner`.
     * @param _tournamentId The identifier of the tournament.
     * @param _playerOne The `Participant` struct for the first player.
     * @param _playerOneScore The score of the first player.
     * @param _playerTwo The `Participant` struct for the second player.
     * @param _playerTwoScore The score of the second player.
     */
    function saveScoreAndAddWinner(
        string memory _tournamentId,
        Participant memory _playerOne,
        uint256 _playerOneScore,
        Participant memory _playerTwo,
        uint256 _playerTwoScore
    ) public onlyOwner {
        saveScore(_tournamentId, _playerOne.uniqueId, _playerOneScore, _playerTwo.uniqueId, _playerTwoScore);

        if (_playerOneScore > _playerTwoScore) {
            addWinner(_tournamentId, _playerOne);
        } else {
            addWinner(_tournamentId, _playerTwo);
        }
    }

    // HELPER FUNCTIONS **********************************************************

    /**
     * @notice Checks if a string is empty.
     * @dev Compares the keccak256 hash of the input string with the hash of an empty string.
     * @param str The string to check.
     * @return bool True if the string is empty, false otherwise.
     */
    function isEmptyString(string memory str) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str)) == keccak256(abi.encodePacked(""));
    }

    /**
     * @notice Finds the most advanced position (highest index) of a player in the tournament bracket.
     * @dev Iterates through the `matchedParticipants` array to find the last occurrence of a player.
     * This index represents their current or final match slot.
     * @param _tournamentId The identifier of the tournament.
     * @param _playerName The unique ID of the player to find.
     * @return uint256 The highest index of the player in the `matchedParticipants` array.
     */
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

    /**
     * @notice Gets the current block timestamp.
     * @dev Internal function to abstract away `block.timestamp`.
     * @return uint256 The current block timestamp in UTC seconds.
     */
    function getCurrentTimestamp() internal view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @dev Converts a count of days since the Unix epoch to a calendar date (year, month, day).
     * @param _days The number of days since 1970-01-01.
     * @return year The calendar year.
     * @return month The calendar month (1-12).
     * @return day The calendar day (1-31).
     */
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

    /**
     * @notice Calculates the full UTC date and time from the block timestamp.
     * @return year The current year.
     * @return month The current month.
     * @return day The current day.
     * @return hour The current hour (0-23).
     * @return minute The current minute (0-59).
     * @return second The current second (0-59).
     */
    function getCurrentDateTimeUTC()
        internal
        view
        returns (uint256 year, uint256 month, uint256 day, uint256 hour, uint256 minute, uint256 second)
    {
        uint256 timestamp = getCurrentTimestamp();
        uint256 SECONDS_PER_DAY = 86400;
        uint256 SECONDS_PER_HOUR = 3600;
        uint256 SECONDS_PER_MINUTE = 60;

        uint256 daysSinceEpoch = timestamp / SECONDS_PER_DAY;
        uint256 secondsInDay = timestamp % SECONDS_PER_DAY;

        hour = (secondsInDay / SECONDS_PER_HOUR) + 1;
        minute = (secondsInDay % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE;
        second = (secondsInDay % SECONDS_PER_HOUR) % SECONDS_PER_MINUTE;

        (year, month, day) = _daysToDate(daysSinceEpoch);
    }

    /**
     * @notice Retrieves the current UTC date.
     * @return date A fixed-size array [day, month, year].
     */
    function getCurrentDate() internal view returns (uint16[3] memory date) {
        (uint256 year, uint256 month, uint256 day,,,) = getCurrentDateTimeUTC();
        date[0] = uint16(day);
        date[1] = uint16(month);
        date[2] = uint16(year);
    }

    /**
     * @notice Retrieves the current UTC time.
     * @return time A fixed-size array [hour, minute, second].
     */
    function getCurrentTime() internal view returns (uint256[3] memory time) {
        (,,, uint256 hour, uint256 minute, uint256 second) = getCurrentDateTimeUTC();
        time[0] = hour;
        time[1] = minute;
        time[2] = second;
    }
}
