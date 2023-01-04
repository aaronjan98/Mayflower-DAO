//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './openzeppelin-contracts/token/ERC20/ERC20.sol';
import './openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol';

contract Token is ERC20 {
    using SafeERC20 for Token;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, 1000000e18);
        transfer(msg.sender, totalSupply());
    }
}
