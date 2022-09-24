// contracts/NFT.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    constructor(
        address _owner,
        uint256 _contractHash
    )
        ERC721("NFTEverywhere", "NFTE")
    {
				owner = _owner;
        contractHash = _contractHash;
	   }

    ////////////////////////////////////// Hash ///////////////////////////////////////////

  uint256 public contractHash;

	////////////////////////////////////// Owner ///////////////////////////////////////////
	address owner;
	modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

	function setOwner(address _owner) public isOwner() {
		owner = _owner;
	}

	//////////////////////////////////// Token /////////////////////////////////////////////////////////////////
	uint256 nftLastId;

    function createNFT(address _owner, string memory _uri)
        public
        returns (uint256)
    {
        nftLastId++;
        _safeMint(_owner, nftLastId);
        _setTokenURI(nftLastId, _uri);
				return nftLastId;
    }

	function burnNFT(uint256 tokenId)
		public
		isOwner()
	{
		_burn(tokenId);
	}

	////////////////////////////////// NFTHistory //////////////////////////
	mapping(address => uint256[]) private historyNFT;

	function _afterTokenTransfer(
		address ,
        address _to,
        uint256 _nftId
	)
		internal
		override
	{
		historyNFT[_to].push(_nftId);
	}

	function nftHistory(address _owner)
		public
		view
		returns (uint256[] memory ret)
	{
		uint256[] storage history = historyNFT[_owner];
		return history;
	}
}
