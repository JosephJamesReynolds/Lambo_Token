// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// @title LamboMoonTrillionaire Token
// The only token guaranteed to make you trillions
contract Token {
    // Token basics - every moon mission needs a name
    string public name;    
    string public symbol;
    uint256 public decimals = 18;  // Using 18 decimals like ETH
    uint256 public totalSupply;    

    // Track balances and allowances - the important stuff
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events - because the blockchain needs receipts
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // Deploy token with name, symbol, and enough supply for everyone
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);  // Convert to wei like ETH
        balanceOf[msg.sender] = totalSupply;          // Creator gets the bag
    }

    // Send tokens from sender to receiver
    function transfer(address _to, uint256 _value) 
        public
        returns (bool success) 
    {
        // Check sender has enough tokens
        require(balanceOf[msg.sender] >= _value, "Not enough tokens to send");

        _transfer(msg.sender, _to, _value);

        return true;
    }

    // Internal function to handle transfers
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0));  // No sending to address zero
        
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;

        emit Transfer(_from, _to, _value);
    }

    // Approve another address to spend tokens
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));  // No approving address zero
        
        allowance[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer tokens on behalf of someone else
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // Check sufficient balance and allowance
        require(_value <= balanceOf[_from], "Not enough tokens in wallet");
        require(_value <= allowance[_from][msg.sender], "Not enough approved tokens");

        // Update allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        // Execute transfer
        _transfer(_from, _to, _value);

        return true;
    }
}