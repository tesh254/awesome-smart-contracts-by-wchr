// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@rari-capital/solmate/src/utils/SafeTransferLib.sol";

contract Kifu {
    struct CreatorAccount {
        address publicKey;
        uint256 kifuReceived;
        string creatorName;
        string createdAt;
        bool isValid;
    }

    mapping(address => CreatorAccount) public creators;

    error Unauthorized();

    error CreatorNotFound();

    event AmountWithdrawn(uint256 amount);

    event ReverseRequest(address indexed donor, uint256 amount);

    event Donated(address indexed donator, uint256 amount);

    constructor() payable {}

    function createCreatorAccount(
        string memory _creatorName,
        string memory _createdAt
    ) public {
        if (creators[msg.sender].publicKey == address(0x0)) {
            creators[msg.sender].publicKey = msg.sender;
            creators[msg.sender].createdAt = _createdAt;
            creators[msg.sender].creatorName = _creatorName;
            creators[msg.sender].kifuReceived = 0;
            creators[msg.sender].isValid = true;
        }
    }

    function donate(address _creator) public payable {
        if (!creators[_creator].isValid) {
            reverseAmount(msg.value);

            revert CreatorNotFound();
        } else {
            creators[_creator].kifuReceived += msg.value;

            emit Donated(msg.sender, msg.value);
        }
    }

    function reverseAmount(uint256 amount) public payable {
        emit ReverseRequest(msg.sender, amount);

        SafeTransferLib.safeTransferETH(msg.sender, amount);
    }

    // emit Donated(msg.sender, msg.value);

    function withdraw() public payable {
        if (creators[msg.sender].isValid) {
            emit AmountWithdrawn(creators[msg.sender].kifuReceived);

            SafeTransferLib.safeTransferETH(
                msg.sender,
                creators[msg.sender].kifuReceived
            );

            creators[msg.sender].kifuReceived = 0;
        } else {
            revert Unauthorized();
        }
    }

    function getCreatorAccountBalance() public view returns (uint256) {
        return creators[msg.sender].kifuReceived;
    }

    function getCreatorAccountName() public view returns (string memory) {
        return creators[msg.sender].creatorName;
    }

    function getCreatorAccountCreatedAt() public view returns (string memory) {
        return creators[msg.sender].createdAt;
    }

    receive() external payable {}
}
