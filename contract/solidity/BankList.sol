// contracts/NFT.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IBank } from './IBank.sol';

struct BankCertificate {
  string name;
  address certificate;
  uint8 grade;
}

struct BankInfo {
  IBank bankContract;
  uint8 grade;
}

contract BankList {
  constructor(
      uint256 _contractHash,
      uint256 _registerFee
  )
  {
      owner = payable( msg.sender);
      contractHash = _contractHash;
      registerFee = _registerFee;
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
  mapping(address => BankInfo) private bankListFromCertificate;
  BankInfo[] private bankList;
  uint64 bankId = 0;

  function getCertificateList(uint8 minGrade) public view returns (BankCertificate[] memory){
    BankCertificate[] memory certificateList;
    uint64 j = 0;
    for (uint64 i = 0; i < bankId; i++){
      if (bankList[i].grade > minGrade){
          certificateList[j] = BankCertificate(
            bankList[i].bankContract.getName(),
            bankList[i].bankContract.getCertificate(),
            bankList[i].grade
          );
          j = j + 1;
      }
    }
    return certificateList;
  }

  function getBankContract(address certificate) public view returns (IBank){
    return bankListFromCertificate[certificate].bankContract;
  }

  ///////////////////////////////////// Register ////////////////////////////////////////
  uint256 public registerFee;

  function registerBank(IBank _bankContract) public payable {
    require(msg.value > registerFee, 'Not enought fee to register');
    BankInfo memory bankInfo = BankInfo(_bankContract, 50);
    bankList.push(bankInfo);
    bankListFromCertificate[bankInfo.bankContract.getCertificate()] = bankInfo;
    bankId = bankId + 1;
  }

}
