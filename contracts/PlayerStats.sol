// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PlayerStats {
    struct Stats {
        uint256 totalScore;
        uint256 targetsHit;
        uint256 gamesPlayed;
        uint256 highestScore;
        uint256 lastPlayed;
    }

    mapping(address => Stats) public playerStats;

    address private _gameAdmin;

    constructor() {
        _gameAdmin = msg.sender;
    }

    function setGameAdmin(address gameAdmin) external {
        require(
            msg.sender == _gameAdmin,
            "Only current admin can set new admin"
        );
        _gameAdmin = gameAdmin;
    }

    modifier onlyGameAdmin() {
        require(
            msg.sender == _gameAdmin,
            "Only game admin can perform this action"
        );
        _;
    }

    function updateStats(
        address player,
        uint256 sessionScore,
        uint256 sessionHits
    ) external onlyGameAdmin {
        Stats storage stats = playerStats[player];
        stats.totalScore += sessionScore;
        stats.targetsHit += sessionHits;
        stats.gamesPlayed += 1;

        if (sessionScore > stats.highestScore) {
            stats.highestScore = sessionScore;
        }

        stats.lastPlayed = block.timestamp;
    }

    function getPlayerStats(
        address player
    ) external view returns (Stats memory) {
        return playerStats[player];
    }
}
