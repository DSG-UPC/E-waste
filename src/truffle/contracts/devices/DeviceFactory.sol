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

  function createDevice(string _name, uint _initValue, address _owner) public
  returns (address newContract){
    require(roleManager.isNotary(msg.sender), "This device contract was not created by a Notary");
    newContract = new DepositDevice(_name,  _owner, _initValue, daoAddress);
    deployed_devices[_owner].push(newContract);
    return newContract;
  }

  function transferDevice(address device, address _to) public{
    // DepositDevice d = DepositDevice(device);
    deleteDevice(msg.sender, device);
    deployed_devices[_to].push(device);
    // d.transferDevice(msg.sender, _to);
  }

  function deleteDevice(address owner, address device) internal{
    uint length = deployed_devices[owner].length;
    for(uint i = 0; i < length; i++){
      if(deployed_devices[owner][i] == device){
        deployed_devices[owner][i] = deployed_devices[owner][length - 1];
        delete deployed_devices[owner][length - 1];
        deployed_devices[owner].length--;
        break;
      }
    }
  }

  function getDeployedDevices() public view returns(address[]){
    return deployed_devices[msg.sender];
  }

}