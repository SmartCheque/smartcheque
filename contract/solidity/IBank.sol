// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IBank {

  function getCertificate() external view returns (address);

  function getName() external view returns (string memory);

}
