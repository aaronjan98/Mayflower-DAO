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
    mapping(address => mapping(uint256 => VoteStatus)) votes;

    struct VoteStatus {
        bool voted;
        bool approve;
    }

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        int256 votes;
        bool finalized;
    }

    event Propose(uint id, uint256 amount, address recipient, address creator);
    event Vote(uint256 id, address investor);
    event Finalize(uint256 id);

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
    function vote(uint256 _id, bool approve) external onlyInvestor {
        // Fetch proposal from mapping
        Proposal storage proposal = proposals[_id];

        // Don't let investors vote twice
        require(!votes[msg.sender][_id].voted, 'already voted');

        // update votes and track that users have voted
        if (approve) {
            proposal.votes += int(token.balanceOf(msg.sender));
            votes[msg.sender][_id].voted = true;
            votes[msg.sender][_id].approve = true;
        } else {
            proposal.votes -= int(token.balanceOf(msg.sender));
            votes[msg.sender][_id].voted = true;
            votes[msg.sender][_id].approve = false;
        }

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
            proposal.votes >= int256(quorum),
            'must reach quorum to finalize proposal'
        );

        require(
            address(this).balance >= proposal.amount,
            'contract must have enough ether'
        );

        // Transfer funds
        (bool sent, ) = proposal.recipient.call{ value: proposal.amount }('');
        require(sent);

        // Emit event
        emit Finalize(_id);
    }
}
