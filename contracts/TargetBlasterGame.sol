// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TargetBlasterNFT.sol";
import "./PlayerStats.sol";

contract TargetBlasterGame {
    TargetBlasterNFT public nftContract;
    PlayerStats public statsContract;

    address private _owner;

    uint256 public nftDropRate = 10;
    uint256 public minimumScoreForNFT = 500;

    constructor(address nftContractAddress, address statsContractAddress) {
        nftContract = TargetBlasterNFT(nftContractAddress);
        statsContract = PlayerStats(statsContractAddress);
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can perform this action");
        _;
    }

    function setNFTDropRate(uint256 rate) external onlyOwner {
        require(rate <= 100, "Rate must be a percentage (0-100)");
        nftDropRate = rate;
    }

    function setMinimumScoreForNFT(uint256 score) external onlyOwner {
        minimumScoreForNFT = score;
    }

    function endGameSession(
        address player,
        uint256 sessionScore,
        uint256 targetsHit,
        uint256 randomSeed
    ) external onlyOwner {
        statsContract.updateStats(player, sessionScore, targetsHit);

        if (sessionScore >= minimumScoreForNFT) {
            uint256 randomValue = uint256(
                keccak256(abi.encodePacked(block.timestamp, randomSeed))
            ) % 100;

            if (randomValue < nftDropRate) {
                TargetBlasterNFT.RewardType rewardType;

                if (sessionScore >= 2000) {
                    rewardType = TargetBlasterNFT.RewardType.Legendary;
                } else if (sessionScore >= 1500) {
                    rewardType = TargetBlasterNFT.RewardType.Epic;
                } else if (sessionScore >= 1000) {
                    rewardType = TargetBlasterNFT.RewardType.Rare;
                } else {
                    rewardType = TargetBlasterNFT.RewardType.Common;
                }

                nftContract.mintReward(
                    player,
                    rewardType,
                    "Standard",
                    sessionScore
                );
            }
        }
    }
}
