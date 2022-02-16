// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

//represents a bid made for a proposal
struct Bid {
    address bidder;
    uint256 proposalRef;        //identifier of relative proposal
    IERC721 nftAddress;         //bidded nft's contract address
    uint256 tokenId;            //bidded nft's contract address
    uint256 indexInProposal;    //index of bid in proposal's bidsRef array
}

//represents a swap proposal
struct Proposal {
    address proposer;
    IERC721 nftAddress;         //proposed nft's contract address
    uint256 tokenId;            //proposed nft's token id
    uint256 proposalId;         //identifier of the proposal
    uint256[] bidsRef;          //list of bids made for the proposal
}

contract NFTSwap {    

    //checks that the specified nft is owned by function caller and approved to this contract
    modifier needsNFT(IERC721 nftAddress, uint256 tokenId) {
        require(nftAddress.getApproved(tokenId) == address(this), "You have to approve the token you want to swap to this contract");
        require(nftAddress.ownerOf(tokenId) == msg.sender, "You do not own the specified nft");
        _;
    }

    //checks that specified proposal exists
    modifier needsExistentProposal(uint256 proposalId) {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0) ), "Specified proposal does not exist" );
        _;
    }

    //checks that specified proposal was made by function caller
    modifier needsProposalOwnership(uint256 proposalId) {
            require( proposals[proposalId].proposer == msg.sender, "Specified proposal is not yours" );
            _;
    }

    //checks that specified bid exists
    modifier needsExistentBid(uint256 bidId) {
            require( bids[bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );
            _;
    }

    //checks that specified bid was made by function caller
    modifier needsBidOwnership(uint256 bidId) {
            require( bids[bidId].bidder == msg.sender, "Specified bid is not yours" );
            _;
    }

    //checks that specified bid is relative to specified proposal
    modifier needsBidOfProposal(uint256 proposalId, uint256 bidId) {
        require( bids[bidId].proposalRef == proposalId, "Specified bid was not made for specified proposal" );
        _;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Bid) public bids;
    uint256 public proposalsCount = 1;      //first unused proposal identifier
    uint256 public bidsCount = 1;           //first unused bid identifier
    uint256[] public proposalsGaps;         //free identifiers of deleted proposals
    uint256[] public bidsGaps;              //free identifiers of deleted bids
    
    constructor() {}
    
    //When a user wants to make a proposal, front end must call approve of the proposed nft to this contract before calling this function
    function makeProposal(IERC721 nftAddress, uint256 tokenId) external needsNFT(nftAddress, tokenId) {

        address proposer = msg.sender;

        uint256 index;
        if (proposalsGaps.length > 0) {
            index = proposalsGaps[proposalsGaps.length - 1];
            proposalsGaps.pop();
        }
        else{
            index = proposalsCount;
            proposalsCount+=1;
        }

        Proposal storage proposal = proposals[index];
        proposal.proposer = proposer;
        proposal.nftAddress = nftAddress;
        proposal.tokenId = tokenId;
        proposal.proposalId = index;
    }

    //When a user wants to make a proposal, front end must call approve of the bidded nft to this contract before calling this function
    function makeBid(uint256 proposalId, IERC721 bidNftAddress, uint256 bidNftTokenId) external needsNFT(bidNftAddress, bidNftTokenId) needsExistentProposal(proposalId){
        
        address bidder = msg.sender;

        Bid memory bid;
        bid.bidder = bidder;
        bid.proposalRef = proposalId;
        bid.nftAddress = bidNftAddress;
        bid.tokenId = bidNftTokenId;
        bid.indexInProposal = proposals[proposalId].bidsRef.length;

        uint256 index;
        if (bidsGaps.length > 0) {
            index = bidsGaps[bidsGaps.length - 1];
            bidsGaps.pop();
        }
        else{
            index = bidsCount;
            bidsCount+=1;
        }
        
        proposals[proposalId].bidsRef.push(index);
        bids[index] = bid;
    }

    //accepts a bid made for a proposal of the function caller
    function acceptBid(uint256 proposalId, uint256 bidId) external needsExistentProposal(proposalId) needsProposalOwnership(proposalId) needsExistentBid(bidId) needsBidOfProposal(proposalId, bidId) {
        
        address proposerAddress = msg.sender;
        address bidderAddress = bids[bidId].bidder;

        IERC721 nftAddress1 = proposals[proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidId].nftAddress;
        uint256 tokenId2 = bids[bidId].tokenId;

        if(nftAddress1.ownerOf(tokenId1) != proposerAddress) {
            deleteProposal_(proposalId);
            revert("You do not own the nft anymore");
        }
        if(nftAddress1.getApproved(tokenId1) != address(this)) {
            revert("You removed approval for the nft to this contract, please re-approve it");
        }
        if(nftAddress2.ownerOf(tokenId2) != bidderAddress) {
            deleteBid_(bidId);
            revert("The bidder does not own the nft anymore. Bid has been deleted.");
        }
        if(nftAddress2.getApproved(tokenId2) != address(this)) {
            deleteBid_(bidId);
            revert("The bidder removed approval for the bidded nft to this contract. Impossible to complete the swap until the bidder re-approves the nft. Bid has been deleted.");
        }

        nftAddress1.safeTransferFrom(proposerAddress, bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidderAddress, proposerAddress, tokenId2);
        
        deleteProposal_(proposalId);
    }

    //refuses a bid made by the function caller
    function refuseBid(uint256 proposalId, uint256 bidId) external needsExistentProposal(proposalId) needsProposalOwnership(proposalId) needsExistentBid(bidId) needsBidOfProposal(proposalId, bidId) {
        deleteBid_(bidId);
    }

    //deletes a proposal of the function caller
    function deleteProposal(uint256 proposalId) external needsExistentProposal(proposalId) needsProposalOwnership(proposalId) {        
        for(uint256 i = 0; i < proposals[proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposalId].bidsRef[i]];       
            bidsGaps.push(proposals[proposalId].bidsRef[i]);
        }
        delete proposals[proposalId];
        proposalsGaps.push(proposalId);
    }

    //deletes any proposal, callable only by this contract
    function deleteProposal_(uint256 proposalId) internal{        
        for(uint256 i = 0; i < proposals[proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposalId].bidsRef[i]];      
            bidsGaps.push(proposals[proposalId].bidsRef[i]);
        }
        delete proposals[proposalId];
        proposalsGaps.push(proposalId);
    }

    //deletes a bid of the function caller
    function deleteBid(uint256 bidId) external needsExistentBid(bidId) needsBidOwnership(bidId) {    
        delete proposals[bids[bidId].proposalRef].bidsRef[bids[bidId].indexInProposal];      
        delete bids[bidId];
        bidsGaps.push(bidId);
    }

    //deletes any bid, callable only by this contract
    function deleteBid_(uint256 bidId) internal{
        delete proposals[bids[bidId].proposalRef].bidsRef[bids[bidId].indexInProposal];     
        delete bids[bidId];
        bidsGaps.push(bidId);
    }
<<<<<<< HEAD
    
    //retrieves all bids mad for a proposal
    function getBidsFromProposal(uint256 proposalId) public view needsExistentProposal(proposalId) returns (uint256[] memory bidsRef) {
        bidsRef = proposals[proposalId].bidsRef;
    }

    //retrieves a specific bid made for a proposal
    function getBidFromProposal(uint8 proposalId, uint256 index) public view needsExistentProposal(proposalId) returns (uint256 bidRef) {
=======

    function getBidsFromProposal(uint256 proposalId) external view returns (uint256[] memory bidsRef) {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        bidsRef = proposals[proposalId].bidsRef;
    }

    function getBidFromProposal(uint8 proposalId, uint256 index) external view returns (uint256 bidRef) {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
>>>>>>> f8eb54b3d82b7662df4454aa57e87d11f9f67c00
        require( proposals[proposalId].bidsRef.length > index, "Specified bid does not exist" );
        bidRef = proposals[proposalId].bidsRef[index];
    }
}