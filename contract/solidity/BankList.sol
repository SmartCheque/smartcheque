// contracts/BankList.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IBank } from './IBank.sol';

struct BankCertificate {
  string name;
  address certificate;
  IBank bankContract;
  uint8 grade;
}

struct BankInfo {
  IBank bankContract;
  uint8 grade;
}

contract BankList {
  constructor(
      uint256 _contractHash
  )
  {
      owner = payable( msg.sender);
      contractHash = _contractHash;
   }

  ////////////////////////////////////// Hash ///////////////////////////////////////////

  uint256 public contractHash;


  ////////////////////////////////////// Owner ///////////////////////////////////////////
  address payable owner;

  modifier _isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function withdraw (uint _amount, address payable _dest) public _isOwner {
        _dest.transfer(_amount);
    }

  ///////////////////////////////////// BankList ////////////////////////////////////////
  mapping(IBank => BankInfo) private bankListFromAddress;
  mapping(uint64 => IBank) private bankAddressFromId;
  mapping(address => IBank) private bankAddressFromCertificate;
  uint64 bankId = 0;

  function getCertificateList() public view returns (BankCertificate[] memory){
    BankCertificate[] memory certificateList = new BankCertificate[](bankId);
    for (uint64 i = 0; i < bankId; i++){
      BankInfo storage bankInfo = bankListFromAddress[bankAddressFromId[i]];
      certificateList[i] = BankCertificate(
        bankInfo.bankContract.getName(),
        bankInfo.bankContract.getCertificate(),
        bankInfo.bankContract,
        bankInfo.grade
      );
    }
    return certificateList;
  }

  function getBankContract(address _certificate) public view returns (IBank){
    return bankAddressFromCertificate[_certificate];
  }

  ///////////////////////////////////// Register ////////////////////////////////////////
  uint256 public registerFee = 0;

  function registerBank(IBank _bankContract) public payable {
    require(msg.value >= registerFee, 'Not enought fee to register');
    BankInfo memory bankInfo = BankInfo(_bankContract, 50);
    address cert = bankInfo.bankContract.getCertificate();
    bankAddressFromCertificate[cert] = _bankContract;
    bankAddressFromId[bankId] = _bankContract;
    bankListFromAddress[_bankContract] = bankInfo;
    bankId = bankId + 1;
  }


  ////////////////////////////////////// Grade ////////////////////////////////////////

  function updateGrade (IBank _bankContract, uint8 _grade) public _isOwner {
      bankListFromAddress[_bankContract].grade = _grade;
  }

}
