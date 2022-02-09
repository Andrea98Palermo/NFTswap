// SPDX-License-Identifier: MIT
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
    //bool accepted;
}

struct Proposal {
    IERC721 nftAddress;
    uint256 tokenId;
    uint8 proposalId;
    BidIdentifier[] bidsRef;
    //bool active;
}

contract NFTSwap {
    //mapping(address => mapping(address => mapping(uint256 => mapping(address => mapping(address => uint256))))) public ledger;

    mapping(address => mapping(uint8 => Proposal)) public proposals;
    mapping(address => mapping(uint8 => Bid)) public bids;
    mapping(address => uint8) private proposalsCount;
    mapping(address => uint8) private bidsCount;
    uint8[] proposalsGaps;
    uint8[] bidsGaps;

    /*
    mapping (address => Proposal[]) public proposals;
    mapping (address => Bid[]) public bids;
    mapping (address => uint8) private proposalsCount;
    mapping (address => uint8) private bidsCount;
    uint8[] proposalsGaps;
    uint8[] bidsGaps;
    */
    constructor() {}

    //quando un utente vuole proporre uno scambio il front end deve chiamare prima l'approve dell'nft verso il contratto e poi questa funzione
    function proposeSwap(IERC721 nftAddress, uint256 tokenId) external {
        //require(nftAddress.getApproved(tokenId) == address(this), "You have to approve the token you want to swap to this contract");

        address proposer = msg.sender;
        require(
            proposalsGaps.length > 0 || proposalsCount[proposer] <= 255,
            "You have too many proposals, delete one before"
        );

        uint8 index;
        if (proposalsGaps.length > 0) {
            index = proposalsGaps[proposalsGaps.length - 1];
            proposalsGaps.pop();
            //proposal.proposalId = index;
            //proposals[proposer][index] = proposal;
        } else {
            index = proposalsCount[proposer];
            proposalsCount[proposer] += 1;
            //proposal.proposalId = index;
            //proposals[proposer].push(proposal);
        }

        Proposal storage proposal = proposals[proposer][index];
        proposal.nftAddress = nftAddress;
        proposal.tokenId = tokenId;
        //proposal.bidsRef = new BidIdentifier[](0);

        //if(count == 0) {count=1;} //0 non usato come indice per permettere di fare il check //if (proposalsGaps[0] != 0)

        //proposals[proposer][index] = proposal;
        proposal.proposalId = index;
    }

    //quando un utente vuole proporre una bid il front end deve chiamare prima l'approve dell'nft verso il contratto e poi questa funzione
    function makeBid(
        address proposerAddress,
        uint8 proposalId,
        IERC721 bidNftAddress,
        uint256 bidNftTokenId
    ) external {
        //require(bidNftAddress.getApproved(bidNftTokenId) == address(this), "You have to approve the token you want to swap to this contract");

        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        ); //TODO: CONTROLLARE CHE IERC721 SIA EFFETTIVIAMENTE INIZIALIZZZATO A IERC721(0X0) DI DEFAULT

        address bidder = msg.sender;
        require(
            bidsGaps.length > 0 || bidsCount[bidder] <= 255,
            "You have too many bids, delete one before"
        );

        Bid memory bid;
        ProposalIdentifier memory proposalRef;
        proposalRef.proposerAddress = proposerAddress;
        proposalRef.proposalId = proposalId;
        bid.proposalRef = proposalRef;
        bid.nftAddress = bidNftAddress;
        bid.tokenId = bidNftTokenId;
        bid.indexInProposal = proposals[proposerAddress][proposalId]
            .bidsRef
            .length;

        uint8 index;
        //BidIdentifier memory bidIdentifier;
        if (bidsGaps.length > 0) {
            index = bidsGaps[bidsGaps.length - 1];
            bidsGaps.pop();
            //bidIdentifier = BidIdentifier(bidder, index);
            //bids[bidder][index] = bid;
        } else {
            index = bidsCount[bidder];
            bidsCount[bidder] += 1;
            //bidIdentifier = BidIdentifier(bidder, index);
            //bids[bidder].push(bid);
        }

        //BidIdentifier[] storage bidsRefs = proposals[proposerAddress][proposalId].bidsRef;

        BidIdentifier memory bidIdentifier;
        bidIdentifier.bidderAddress = bidder;
        bidIdentifier.bidId = index;
        //bidsRefs.push(bidIdentifier);
        proposals[proposerAddress][proposalId].bidsRef.push(bidIdentifier);

        bids[bidder][index] = bid;
    }

    function acceptBid(
        uint8 proposalId,
        address bidderAddress,
        uint8 bidId
    ) external {
        address proposerAddress = msg.sender;
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        require(
            bids[bidderAddress][bidId].nftAddress != IERC721(address(0x0)),
            "Specified bid does not exist"
        );

        IERC721 nftAddress1 = proposals[proposerAddress][proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposerAddress][proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidderAddress][bidId].nftAddress;
        uint256 tokenId2 = bids[bidderAddress][bidId].tokenId;

        nftAddress1.safeTransferFrom(proposerAddress, bidderAddress, tokenId1);
        nftAddress2.safeTransferFrom(bidderAddress, proposerAddress, tokenId2);

        for (
            uint256 i = 0;
            i < proposals[proposerAddress][proposalId].bidsRef.length;
            i++
        ) {
            delete bids[
                proposals[proposerAddress][proposalId].bidsRef[i].bidderAddress
            ][proposals[proposerAddress][proposalId].bidsRef[i].bidId];
            bidsGaps.push(
                proposals[proposerAddress][proposalId].bidsRef[i].bidId
            );
        }
        delete proposals[proposerAddress][proposalId];
        //delete bids[bidderAddress][bidId];
        proposalsGaps.push(proposalId);
        //bidsGaps.push(bidId);
    }

    function acceptBid(uint8 proposalId, uint256 bidIndex) external {
        address proposerAddress = msg.sender;
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        require(
            proposals[proposerAddress][proposalId]
                .bidsRef[bidIndex]
                .bidderAddress != address(0x0),
            "Specified bid does not exist"
        );
        BidIdentifier memory bidIdentifier = proposals[proposerAddress][
            proposalId
        ].bidsRef[bidIndex];

        IERC721 nftAddress1 = proposals[proposerAddress][proposalId].nftAddress;
        uint256 tokenId1 = proposals[proposerAddress][proposalId].tokenId;
        IERC721 nftAddress2 = bids[bidIdentifier.bidderAddress][
            bidIdentifier.bidId
        ].nftAddress;
        uint256 tokenId2 = bids[bidIdentifier.bidderAddress][
            bidIdentifier.bidId
        ].tokenId;

        nftAddress1.safeTransferFrom(
            proposerAddress,
            bidIdentifier.bidderAddress,
            tokenId1
        );
        nftAddress2.safeTransferFrom(
            bidIdentifier.bidderAddress,
            proposerAddress,
            tokenId2
        );

        for (
            uint256 i = 0;
            i < proposals[proposerAddress][proposalId].bidsRef.length;
            i++
        ) {
            delete bids[
                proposals[proposerAddress][proposalId].bidsRef[i].bidderAddress
            ][proposals[proposerAddress][proposalId].bidsRef[i].bidId];
            bidsGaps.push(
                proposals[proposerAddress][proposalId].bidsRef[i].bidId
            );
        }
        delete proposals[proposerAddress][proposalId];
        //delete bids[bidderAddress][bidId];
        proposalsGaps.push(proposalId);
        //bidsGaps.push(bidId);
    }

    function refuseBid(
        uint8 proposalId,
        address bidder,
        uint8 bidId
    ) external {
        address proposerAddress = msg.sender;
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        require(
            bids[bidder][bidId].nftAddress != IERC721(address(0x0)),
            "Specified bid does not exist"
        );

        delete proposals[bids[bidder][bidId].proposalRef.proposerAddress][
            bids[bidder][bidId].proposalRef.proposalId
        ].bidsRef[bids[bidder][bidId].indexInProposal]; //gap unhandled
        delete bids[bidder][bidId];
        bidsGaps.push(bidId);
    }

    function refuseBid(uint8 proposalId, uint256 bidIndex) external {
        address proposerAddress = msg.sender;
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        require(
            proposals[proposerAddress][proposalId]
                .bidsRef[bidIndex]
                .bidderAddress != address(0x0),
            "Specified bid does not exist"
        );

        BidIdentifier memory bidIdentifier = proposals[proposerAddress][
            proposalId
        ].bidsRef[bidIndex];
        delete proposals[
            bids[bidIdentifier.bidderAddress][bidIdentifier.bidId]
                .proposalRef
                .proposerAddress
        ][
            bids[bidIdentifier.bidderAddress][bidIdentifier.bidId]
                .proposalRef
                .proposalId
        ].bidsRef[
                bids[bidIdentifier.bidderAddress][bidIdentifier.bidId]
                    .indexInProposal
            ]; //gap unhandled
        delete bids[bidIdentifier.bidderAddress][bidIdentifier.bidId];
        bidsGaps.push(bidIdentifier.bidId);
    }

    function deleteProposal(uint8 proposalId) external {
        address proposer = msg.sender;
        require(
            proposals[proposer][proposalId].nftAddress != IERC721(address(0x0)),
            "Specified proposal does not exist"
        );

        for (
            uint256 i = 0;
            i < proposals[proposer][proposalId].bidsRef.length;
            i++
        ) {
            delete bids[
                proposals[proposer][proposalId].bidsRef[i].bidderAddress
            ][proposals[proposer][proposalId].bidsRef[i].bidId];
            bidsGaps.push(proposals[proposer][proposalId].bidsRef[i].bidId);
        }
        delete proposals[proposer][proposalId];
        proposalsGaps.push(proposalId);
    }

    function deleteBid(uint8 bidId) external {
        address bidder = msg.sender;
        require(
            bids[bidder][bidId].nftAddress != IERC721(address(0x0)),
            "Specified bid does not exist"
        );

        delete proposals[bids[bidder][bidId].proposalRef.proposerAddress][
            bids[bidder][bidId].proposalRef.proposalId
        ].bidsRef[bids[bidder][bidId].indexInProposal]; //gap unhandled
        delete bids[bidder][bidId];
        bidsGaps.push(bidId);
    }

    function getBidsFromProposal(address proposerAddress, uint8 proposalId)
        public
        view
        returns (BidIdentifier[] memory bidsRef)
    {
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        bidsRef = proposals[proposerAddress][proposalId].bidsRef;
    }

    function getBidFromProposal(
        address proposerAddress,
        uint8 proposalId,
        uint256 index
    ) public view returns (BidIdentifier memory bidRef) {
        require(
            proposals[proposerAddress][proposalId].nftAddress !=
                IERC721(address(0x0)),
            "Specified proposal does not exist"
        );
        require(
            proposals[proposerAddress][proposalId].bidsRef.length > index,
            "Specified bid does not exist"
        );
        bidRef = proposals[proposerAddress][proposalId].bidsRef[index];
    }

    function helloWorld() public pure returns (string memory) {
        return "Hello World";
    }
}
