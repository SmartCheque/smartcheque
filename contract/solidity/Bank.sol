// contracts/Bank.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IBank } from './IBank.sol';

struct Customer {
  string name;
  address payable wallet;
  uint256 balance;
  uint256 stake;
  uint256 grade;
  uint256 allowance;
}

contract Bank is IBank {


  mapping(address => Customer) private customerList;

  constructor(
      string memory _name,
      uint256 _contractHash
  )
  {
      owner = payable( msg.sender);
      contractHash = _contractHash;
      name = _name;
   }

   ////////////////////////////////////// Hash ///////////////////////////////////////////

   uint256 public contractHash;


   ////////////////////////////////////// Owner ///////////////////////////////////////////
    string name;
   address payable owner;

   modifier _isOwner() {
         require(msg.sender == owner, "Not owner");
         _;
     }

     function withdraw (uint _amount, address payable _dest) public _isOwner {
         _dest.transfer(_amount);
     }

  ///////////////////////////////////// Info /////////////////////////////////////////

    function getCertificate() public view override returns (address) {
      return owner;
    }

    function getName() public view override returns (string memory) {
      return name;
    }

    ////////////////////////////////// Balance ////////////////////////////////

    function getBalance() public view returns (uint256){
      return customerList[msg.sender].balance;
    }



    function addBalance() payable public {
    customerList[msg.sender].balance = customerList[msg.sender].balance + msg.value;
  }



    function withdrawBalance(uint256 _amount) public {
        require(customerList[msg.sender].grade >= 50);
        require(_amount <= customerList[msg.sender].balance - customerList[msg.sender].stake);
        customerList[msg.sender].balance = customerList[msg.sender].balance - _amount;
        payable(msg.sender).transfer(_amount);
    }



    //////////////////////////////// Stake /////////////////////////////////////

    function getCustomerStake(address _customer) public view returns (uint256){
      return customerList[_customer].stake;
    }

    function getStake() public view returns (uint256){
      return customerList[msg.sender].stake;
    }

    function addStake(uint256 _amount) payable public {
      require(_amount <= customerList[msg.sender].balance, 'not enought');
      customerList[msg.sender].balance = customerList[msg.sender].balance + msg.value - _amount;
      customerList[msg.sender].stake = customerList[msg.sender].stake + msg.value + _amount;
    }

    function removeStake(uint256 _amount) public {
      require(customerList[msg.sender].grade >= 50, 'bad grade');
      require(_amount <= customerList[msg.sender].stake, 'not enought');
      require(customerList[msg.sender].allowance > 0 && customerList[msg.sender].allowance < block.timestamp, 'still allowance');
      customerList[msg.sender].stake = customerList[msg.sender].stake - _amount;
      customerList[msg.sender].balance = customerList[msg.sender].balance + _amount;
    }

  ////////////////////////////////// grade //////////////////////////////////

  function updateGrade(address _customer, uint8 _grade) public _isOwner {
    customerList[_customer].grade = _grade;
  }

  ///////////////////////////////// process transaction /////////////////////

  mapping(bytes32 => bool) private processedTransaction;

  function processPayment (
    address payable _merchantAddress,
    address _customerAddress,
    uint256 _amount,
    uint256 _time,
    uint8 _merchant_v,
    bytes32 _merchant_r,
    bytes32 _merchant_s,
    uint8 _customer_v,
    bytes32 _customer_r,
    bytes32 _customer_s
  ) public {
    string memory prefix = "\x19Ethereum Signed Message:\n32";
    //Check duplicate
    bytes32 hashMessage = keccak256(abi.encodePacked(
                prefix,
                _customerAddress,
                _merchantAddress,
                _amount,
                _time
            ));
    require(processedTransaction[hashMessage] == false, 'transaction already processes');
    processedTransaction[hashMessage] = true;

    //chech signature merchant
    hashMessage = keccak256(abi.encodePacked(
                prefix,
                _amount,
                _time
            ));
    require(_merchantAddress == ecrecover(
      hashMessage,
      _merchant_v,
      _merchant_r,
      _merchant_s
    ), 'Invalid mechant signature');

    //chech signature customer
    hashMessage = keccak256(abi.encodePacked(
                prefix,
                owner, //bank certificate
                _merchantAddress,
                _amount,
                _time
            ));
    require(_customerAddress == ecrecover(
      hashMessage,
      _customer_v,
      _customer_r,
      _customer_s
    ), 'Invalid customer signature');
    if (customerList[_customerAddress].balance < _amount){
      //Fraud !!!
      customerList[_customerAddress].grade = 0;
      customerList[_merchantAddress].grade = 0;
      customerList[_merchantAddress].stake = customerList[_merchantAddress].stake + customerList[_customerAddress].balance;
      customerList[_customerAddress].balance = 0;
      customerList[_customerAddress].stake = 0;
    } else {
      //Pay the merchant
      _merchantAddress.transfer(_amount);
      customerList[_customerAddress].balance = customerList[_customerAddress].balance - _amount;
      if (customerList[_customerAddress].stake > customerList[_customerAddress].balance) {
          customerList[_customerAddress].stake = customerList[_customerAddress].balance;
      }
    }
  }
}
