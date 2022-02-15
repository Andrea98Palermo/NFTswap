// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct Bid {
    address bidder;
    uint256 proposalRef;
    IERC721 nftAddress;
    uint256 tokenId;
    uint256 indexInProposal;
}

struct Proposal {
    address proposer;
    IERC721 nftAddress;
    uint256 tokenId;
    uint256 proposalId;
    uint256[] bidsRef;
}

contract NFTSwap {    
    
    //mapping (address => mapping(uint8 => Proposal)) public proposals;
    //mapping (address => mapping(uint8 => Bid)) public bids;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Bid) public bids;
    uint256 public proposalsCount = 1;
    uint256 public bidsCount = 1;
    uint256[] public proposalsGaps;
    uint256[] public bidsGaps;
    
    constructor() {}
    
    //when a user wants to make a proposal, front end must call approve of the nft on this contract before calling this function
    function makeProposal(IERC721 nftAddress, uint256 tokenId) external {

        require(nftAddress.getApproved(tokenId) == address(this), "You have to approve the token you want to swap to this contract");

        address proposer = msg.sender;
        require(nftAddress.ownerOf(tokenId) == proposer, "You do not own the specified nft");
        //require( proposalsCount <= 255 || proposalsGaps.length > 0, "You have too many proposals, delete one before");

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

    //quando un utente vuole proporre una bid il front end deve chiamare prima l'approve dell'nft verso il contratto e poi questa funzione
    function makeBid(uint256 proposalId, IERC721 bidNftAddress, uint256 bidNftTokenId) external {
        
        require(bidNftAddress.getApproved(bidNftTokenId) == address(this), "You have to approve the token you want to swap to this contract");
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        
        address bidder = msg.sender;
        require(bidNftAddress.ownerOf(bidNftTokenId) == bidder, "You do not own the specified nft");
        //require(bidsGaps.length > 0 || bidsCount <= 255, "You have too many bids, delete one before");

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

    function acceptBid(uint256 proposalId, uint256 bidId) external {
        
        address proposerAddress = msg.sender;
        address bidderAddress = bids[bidId].bidder;
        require( proposals[proposalId].nftAddress != IERC721(address(0x0) ), "Specified proposal does not exist" );
        require( proposals[proposalId].proposer == proposerAddress, "Specified proposal is not yours" );
        require( bids[bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );

        IERC721 nftAddress1 = proposals[proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidId].nftAddress;
        uint256 tokenId2 = bids[bidId].tokenId;

        if(nftAddress1.ownerOf(tokenId1) != proposerAddress) {
            deleteProposal_(proposalId);
            revert("You do not own the nft anymore");
        }
        if(nftAddress1.getApproved(tokenId1) != address(this)) {
            deleteProposal_(proposalId);
            revert("You removed approval for the nft to this contract, please re-approve it");
        }
        if(nftAddress2.ownerOf(tokenId2) != bidderAddress) {
            deleteBid_(bidId);
            revert("The bidder does not own the nft anymore");
        }
        if(nftAddress2.getApproved(tokenId2) != address(this)) {
            deleteBid_(bidId);
            revert("The bidder removed approval for the bidded nft to this contract. Impossible to complete the swap until the bidder re-approves the nft");
        }

        nftAddress1.safeTransferFrom(proposerAddress, bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidderAddress, proposerAddress, tokenId2);
        
        deleteProposal_(proposalId);
    }

    /** 
    function acceptBid(uint8 proposalId, uint256 bidIndex) external {
        
        address proposerAddress = msg.sender;
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposerAddress][proposalId].bidsRef[bidIndex].bidderAddress != address(0x0), "Specified bid does not exist" );
        
        BidIdentifier memory bidIdentifier = proposals[proposerAddress][proposalId].bidsRef[bidIndex];
        IERC721 nftAddress1 = proposals[proposerAddress][proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposerAddress][proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidIdentifier.bidderAddress][bidIdentifier.bidId].nftAddress;
        uint256 tokenId2 = bids[bidIdentifier.bidderAddress][bidIdentifier.bidId].tokenId;

        if(nftAddress1.ownerOf(tokenId1) != proposerAddress) {
            deleteProposal(proposerAddress, proposalId);
            revert("You do not own the nft anymore");
        }
        if(nftAddress1.getApproved(tokenId1) != address(this)) {
            deleteProposal(proposerAddress, proposalId);
            revert("You removed approval for the nft to this contract, please re-approve it");
        }

        address bidderAddress = bidIdentifier.bidderAddress;
        uint8 bidId = bidIdentifier.bidId;
        if(nftAddress2.ownerOf(tokenId2) != bidderAddress) {
            deleteBid(bidderAddress, bidId);
            revert("The bidder does not own the nft anymore");
        }
        if(nftAddress2.getApproved(tokenId2) != address(this)) {
            deleteBid(bidderAddress, bidId);
            revert("The bidder removed approval for the bidded nft to this contract. Impossible to complete the swap until the bidder re-approves the nft");
        }

        nftAddress1.safeTransferFrom(proposerAddress, bidIdentifier.bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidIdentifier.bidderAddress, proposerAddress, tokenId2);
        
        deleteProposal(proposerAddress, proposalId);
    }
    */

    function refuseBid(uint256 proposalId, uint256 bidId) external {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposalId].proposer == msg.sender, "Specified proposal is not yours" );
        require( bids[bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );

        deleteBid_(bidId);
    }

    /*
    function refuseBid(uint8 proposalId, uint256 bidIndex) external {
        address proposerAddress = msg.sender;
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposerAddress][proposalId].bidsRef[bidIndex].bidderAddress != address(0x0), "Specified bid does not exist" );
    
        BidIdentifier memory bidIdentifier = proposals[proposerAddress][proposalId].bidsRef[bidIndex];
        deleteBid(bidIdentifier.bidderAddress, bidIdentifier.bidId);
    }
    */

    function deleteProposal(uint256 proposalId) external{
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposalId].proposer == msg.sender, "Specified proposal is not yours" );
        
        for(uint256 i = 0; i < proposals[proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposalId].bidsRef[i]];    //se c'è un buco nell'array bidsRef verrà cancellata proposals[0x0][0], valutare se conviene fare un check 
            bidsGaps.push(proposals[proposalId].bidsRef[i]);
        }
        delete proposals[proposalId];
        proposalsGaps.push(proposalId);
    }

    function deleteProposal_(uint256 proposalId) internal{
        
        for(uint256 i = 0; i < proposals[proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposalId].bidsRef[i]];    //se c'è un buco nell'array bidsRef verrà cancellata proposals[0x0][0], valutare se conviene fare un check 
            bidsGaps.push(proposals[proposalId].bidsRef[i]);
        }
        delete proposals[proposalId];
        proposalsGaps.push(proposalId);
    }

    function deleteBid(uint256 bidId) external{
        require( bids[bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );
        require( bids[bidId].bidder == msg.sender, "Specified bid is not yours" );
        
        delete proposals[bids[bidId].proposalRef].bidsRef[bids[bidId].indexInProposal];      //gap unhandled
        delete bids[bidId];
        bidsGaps.push(bidId);
    }

    function deleteBid_(uint256 bidId) internal{
        
        delete proposals[bids[bidId].proposalRef].bidsRef[bids[bidId].indexInProposal];      //gap unhandled
        delete bids[bidId];
        bidsGaps.push(bidId);
    }

    function getBidsFromProposal(uint256 proposalId) public view returns (uint256[] memory bidsRef) {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        bidsRef = proposals[proposalId].bidsRef;
    }

    function getBidFromProposal(uint8 proposalId, uint256 index) public view returns (uint256 bidRef) {
        require( proposals[proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposalId].bidsRef.length > index, "Specified bid does not exist" );
        bidRef = proposals[proposalId].bidsRef[index];
    }
}