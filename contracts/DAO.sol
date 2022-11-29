// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './Token.sol';

contract DAO {
    address owner;
    Token public token;

    uint256 public quorum;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) votes;

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
    }

    event Propose(uint id, uint256 amount, address recipient, address creator);
    event Vote(uint256 id, address investor);

    constructor(Token _token, uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }

    receive() external payable {}

    modifier onlyInvestor() {
        require(token.balanceOf(msg.sender) > 0, 'must be token holder');
        _;
    }

    function createProposal(
        string memory _name,
        uint256 _amount,
        address payable _recipient
    ) external onlyInvestor {
        require(
            address(this).balance >= _amount,
            'DAO must have enough funds for the proposal'
        );

        proposalCount++;

        // Create Proposal
        proposals[proposalCount] = Proposal(
            proposalCount,
            _name,
            _amount,
            _recipient,
            0,
            false
        );

        emit Propose(proposalCount, _amount, _recipient, msg.sender);
    }

    // Vote on Proposal
    function vote(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping
        Proposal storage proposal = proposals[_id];

        // Don't let investors vote twice
        require(!votes[msg.sender][_id], 'already voted');

        // update votes
        proposal.votes += token.balanceOf(msg.sender);

        // Track that users have voted
        votes[msg.sender][_id] = true;

        emit Vote(_id, msg.sender);
    }

    // Finalize proposal & transfer funds
    function finalizeProposal(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping
        Proposal storage proposal = proposals[_id];

        require(!proposal.finalized, 'proposal already finalized');

        // Mark proposal as finalized
        proposal.finalized = true;

        require(
            proposal.votes >= quorum,
            'must reach quorum to finalize proposal'
        );

        // Transfer the funds

        // Emit event
    }
}
