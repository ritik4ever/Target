// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TargetBlasterNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum RewardType {
        Common,
        Rare,
        Epic,
        Legendary
    }

    struct NFTMetadata {
        RewardType rewardType;
        string targetType;
        uint256 scoreValue;
        uint256 mintedAt;
    }

    mapping(uint256 => NFTMetadata) public nftMetadata;

    string private _baseTokenURI;
    address private _gameAdmin;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
        _gameAdmin = msg.sender;
    }

    function setGameAdmin(address gameAdmin) external onlyOwner {
        _gameAdmin = gameAdmin;
    }

    modifier onlyGameAdmin() {
        require(
            msg.sender == _gameAdmin,
            "Only game admin can perform this action"
        );
        _;
    }

    function mintReward(
        address player,
        RewardType rewardType,
        string memory targetType,
        uint256 scoreValue
    ) external onlyGameAdmin returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(player, newTokenId);

        nftMetadata[newTokenId] = NFTMetadata({
            rewardType: rewardType,
            targetType: targetType,
            scoreValue: scoreValue,
            mintedAt: block.timestamp
        });

        return newTokenId;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
