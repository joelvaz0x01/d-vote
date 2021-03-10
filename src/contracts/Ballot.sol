// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/// @title Election contract
/// @author Joel Vaz
/// @notice Authorize and vote contract with end vote time

contract Ballot {

    struct Voter {
        uint voteIndex;
        bool voted;
        bool weight; //authorization
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Database {
        string userID;
        address voter;
    }

    address public owner = msg.sender;
    mapping(address => Voter) public voters;
    mapping(string => Database) public users;
    Candidate[] public candidates;
    //uint public endTime = block.timestamp + 120;
    uint public endTime = block.timestamp + 86400; //86400 = 24 hours
    uint public totalVotes = 0;
    uint public candidatesCount = 0;
    uint public currentUsers = 0;
    uint public maxUsers = 10;

    modifier OnlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier VotingRequest() {
        require(block.timestamp < endTime, "You can't vote right now");
        require(!voters[msg.sender].voted, "You already voted");
        _;
    }

    constructor(string[] memory _candidateName) {
        for (uint i = 0; i < _candidateName.length; i++) {
            candidatesCount ++;
            candidates.push(Candidate({
                name: _candidateName[i],
                voteCount: 0}));
        }
    }

    function giveRightToVote(address _voterAddress) public OnlyOwner VotingRequest {
        voters[_voterAddress].weight = true;
    }

    function vote(uint _voteIndex) public VotingRequest {
        require(voters[msg.sender].weight, "You don't have authorization");
        voters[msg.sender].voteIndex = _voteIndex;
        voters[msg.sender].voted = true;
        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
    }

    function database(string memory _userID, address _voterAddress) public OnlyOwner {
        require(currentUsers < maxUsers, "More than maxVoters");
        users[_userID].voter = _voterAddress;
        users[_userID].userID = _userID;
        currentUsers += 1;
    }
}
