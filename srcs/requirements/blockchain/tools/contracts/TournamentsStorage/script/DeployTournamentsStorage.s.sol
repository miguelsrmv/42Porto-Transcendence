// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {TournamentsStorage} from "../src/TournamentsStorage.sol";

contract DeployTournamentsStorage is Script {
    function run() external returns (TournamentsStorage) {
        vm.startBroadcast();
        TournamentsStorage tournamentsStorage = new TournamentsStorage();
        console.log("Created a new TournamentsStorage contract!");
        vm.stopBroadcast();
        return tournamentsStorage;
    }
}
