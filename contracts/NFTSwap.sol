pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct ProposalIdentifier {
    address proposerAddress;
    uint8 proposalId;
}

struct BidIdentifier {
    address bidderAddress;
    uint8 bidId;
}

struct Bid {
    ProposalIdentifier proposalRef;
    IERC721 nftAddress;
    uint256 tokenId;
    uint256 indexInProposal;
}

struct Proposal {
    IERC721 nftAddress;
    uint256 tokenId;
    uint8 proposalId;
    BidIdentifier[] bidsRef;
}


contract NFTSwap {    
    
    mapping (address => mapping(uint8 => Proposal)) public proposals;
    mapping (address => mapping(uint8 => Bid)) public bids;
    mapping (address => uint8) private proposalsCount;
    mapping (address => uint8) private bidsCount;
    mapping(address => uint8[]) private proposalsGaps;
    mapping(address => uint8[]) private bidsGaps;
    
    constructor() {}
    
    //when a user wants to make a proposal, front end must call approve of the nft on this contract before calling this function
    function makeProposal(IERC721 nftAddress, uint256 tokenId) external {

        require(nftAddress.getApproved(tokenId) == address(this), "You have to approve the token you want to swap to this contract");

        address proposer = msg.sender;
        require(nftAddress.ownerOf(tokenId) == proposer, "You do not own the specified nft");
        require( proposalsCount[proposer] <= 255 || proposalsGaps[proposer].length > 0, "You have too many proposals, delete one before");

        uint8 index;
        if (proposalsGaps[proposer].length > 0) {
            index = proposalsGaps[proposer][proposalsGaps[proposer].length - 1];
            proposalsGaps[proposer].pop();
        }
        else{
            index = proposalsCount[proposer];
            proposalsCount[proposer]+=1;
        }

        Proposal storage proposal = proposals[proposer][index];
        proposal.nftAddress = nftAddress;
        proposal.tokenId = tokenId;
        proposal.proposalId = index;
    }

    //quando un utente vuole proporre una bid il front end deve chiamare prima l'approve dell'nft verso il contratto e poi questa funzione
    function makeBid(address proposerAddress, uint8 proposalId, IERC721 bidNftAddress, uint256 bidNftTokenId) external {
        
        require(bidNftAddress.getApproved(bidNftTokenId) == address(this), "You have to approve the token you want to swap to this contract");
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        
        address bidder = msg.sender;
        require(bidNftAddress.ownerOf(bidNftTokenId) == bidder, "You do not own the specified nft");
        require(bidsGaps[bidder].length > 0 || bidsCount[bidder] <= 255, "You have too many bids, delete one before");

        Bid memory bid;
        ProposalIdentifier memory proposalRef;
        proposalRef.proposerAddress = proposerAddress;
        proposalRef.proposalId = proposalId;
        bid.proposalRef = proposalRef;
        bid.nftAddress = bidNftAddress;
        bid.tokenId = bidNftTokenId;
        bid.indexInProposal = proposals[proposerAddress][proposalId].bidsRef.length;

        uint8 index;
        if (bidsGaps[bidder].length > 0) {
            index = bidsGaps[bidder][bidsGaps[bidder].length - 1];
            bidsGaps[bidder].pop();
        }
        else{
            index = bidsCount[bidder];
            bidsCount[bidder]+=1;
        }
        
        BidIdentifier memory bidIdentifier;
        bidIdentifier.bidderAddress = bidder;
        bidIdentifier.bidId = index;
        
        proposals[proposerAddress][proposalId].bidsRef.push(bidIdentifier);
        bids[bidder][index] = bid;
    }

    function acceptBid(uint8 proposalId, address bidderAddress, uint8 bidId) external {
        
        address proposerAddress = msg.sender;
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( bids[bidderAddress][bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );

        IERC721 nftAddress1 = proposals[proposerAddress][proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposerAddress][proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidderAddress][bidId].nftAddress;
        uint256 tokenId2 = bids[bidderAddress][bidId].tokenId;

        if(nftAddress1.ownerOf(tokenId1) != proposerAddress) {
            deleteProposal(proposerAddress, proposalId);
            revert("You do not own the nft anymore");
        }
        if(nftAddress2.ownerOf(tokenId2) != bidderAddress) {
            deleteBid(bidderAddress, bidId);
            revert("The bidder does not own the nft anymore");
        }

        nftAddress1.safeTransferFrom(proposerAddress, bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidderAddress, proposerAddress, tokenId2);
        
        deleteProposal(proposerAddress, proposalId);
    }

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

        address bidderAddress = bidIdentifier.bidderAddress;
        uint8 bidId = bidIdentifier.bidId;
        if(nftAddress2.ownerOf(tokenId2) != bidderAddress) {
            deleteBid(bidderAddress, bidId);
            revert("The bidder does not own the nft anymore");
        }

        nftAddress1.safeTransferFrom(proposerAddress, bidIdentifier.bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidIdentifier.bidderAddress, proposerAddress, tokenId2);
        
        deleteProposal(proposerAddress, proposalId);
    }

    function refuseBid(uint8 proposalId, address bidder, uint8 bidId) external {
        address proposerAddress = msg.sender;
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( bids[bidder][bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );

        delete proposals[bids[bidder][bidId].proposalRef.proposerAddress][bids[bidder][bidId].proposalRef.proposalId].bidsRef[bids[bidder][bidId].indexInProposal];      //gap unhandled
        delete bids[bidder][bidId];
        bidsGaps[bidder].push(bidId);
    }

    function refuseBid(uint8 proposalId, uint256 bidIndex) external {
        address proposerAddress = msg.sender;
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require( proposals[proposerAddress][proposalId].bidsRef[bidIndex].bidderAddress != address(0x0), "Specified bid does not exist" );
    
        BidIdentifier memory bidIdentifier = proposals[proposerAddress][proposalId].bidsRef[bidIndex];
        delete proposals[bids[bidIdentifier.bidderAddress][bidIdentifier.bidId].proposalRef.proposerAddress][bids[bidIdentifier.bidderAddress][bidIdentifier.bidId].proposalRef.proposalId].bidsRef[bids[bidIdentifier.bidderAddress][bidIdentifier.bidId].indexInProposal];      //gap unhandled
        delete bids[bidIdentifier.bidderAddress][bidIdentifier.bidId];
        bidsGaps[bidIdentifier.bidderAddress].push(bidIdentifier.bidId);
    }

    function deleteProposal(uint8 proposalId) external{
        address proposer = msg.sender;
        require( proposals[proposer][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        
        for(uint256 i = 0; i < proposals[proposer][proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposer][proposalId].bidsRef[i].bidderAddress][proposals[proposer][proposalId].bidsRef[i].bidId];    //se c'è un buco nell'array bidsRef verrà cancellata proposals[0x0][0], valutare se conviene fare un check 
            bidsGaps[proposals[proposer][proposalId].bidsRef[i].bidderAddress].push(proposals[proposer][proposalId].bidsRef[i].bidId);
        }
        delete proposals[proposer][proposalId];
        proposalsGaps[proposer].push(proposalId);
    }

    function deleteProposal(address proposer, uint8 proposalId) internal{
        require( proposals[proposer][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        
        for(uint256 i = 0; i < proposals[proposer][proposalId].bidsRef.length; i++) {
            delete bids[proposals[proposer][proposalId].bidsRef[i].bidderAddress][proposals[proposer][proposalId].bidsRef[i].bidId];    //se c'è un buco nell'array bidsRef verrà cancellata proposals[0x0][0], valutare se conviene fare un check 
            bidsGaps[proposals[proposer][proposalId].bidsRef[i].bidderAddress].push(proposals[proposer][proposalId].bidsRef[i].bidId);
        }
        delete proposals[proposer][proposalId];
        proposalsGaps[proposer].push(proposalId);
    }

    function deleteBid(uint8 bidId) external{
        address bidder = msg.sender;
        require( bids[bidder][bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );
        
        delete proposals[bids[bidder][bidId].proposalRef.proposerAddress][bids[bidder][bidId].proposalRef.proposalId].bidsRef[bids[bidder][bidId].indexInProposal];      //gap unhandled
        delete bids[bidder][bidId];
        bidsGaps[bidder].push(bidId);
    }

    function deleteBid(address bidder, uint8 bidId) internal{
        require( bids[bidder][bidId].nftAddress != IERC721(address(0x0)), "Specified bid does not exist" );
        
        delete proposals[bids[bidder][bidId].proposalRef.proposerAddress][bids[bidder][bidId].proposalRef.proposalId].bidsRef[bids[bidder][bidId].indexInProposal];      //gap unhandled
        delete bids[bidder][bidId];
        bidsGaps[bidder].push(bidId);
    }

    function getBidsFromProposal(address proposerAddress, uint8 proposalId) public view returns (BidIdentifier[] memory bidsRef) {
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        bidsRef = proposals[proposerAddress][proposalId].bidsRef;
    }

    function getBidFromProposal(address proposerAddress, uint8 proposalId, uint256 index) public view returns (BidIdentifier memory bidRef) {
        require( proposals[proposerAddress][proposalId].nftAddress != IERC721(address(0x0)), "Specified proposal does not exist" );
        require(proposals[proposerAddress][proposalId].bidsRef.length > index, "Specified bid does not exist");
        bidRef = proposals[proposerAddress][proposalId].bidsRef[index];
    }
}