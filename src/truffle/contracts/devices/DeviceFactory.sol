pragma solidity ^0.4.25;

import "./DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "contracts/helpers/RoleManager.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DeviceFactory {
  address public daoAddress;
  DAOInterface public dao;
  RoleManager roleManager;
  mapping(address => address[]) deployed_devices;

  constructor(address _daoAddress) public {
    daoAddress = _daoAddress;
    dao = DAOInterface(daoAddress);
    address roleManagerAddress = dao.getRoleManager();
    roleManager = RoleManager(roleManagerAddress);
  }

  function createDevice(string _name, uint _initValue, address _owner)
  public
  returns (address newContract)
  {
    require(roleManager.isNotary(msg.sender), "This device contract was not created by a Notary");
    newContract = new DepositDevice(_name,  _owner, _initValue, daoAddress);
    deployed_devices[_owner].push(newContract);
    return newContract;
  }

  function getDeployedDevices() public view returns(address[]){
    return deployed_devices[msg.sender];
  }

}