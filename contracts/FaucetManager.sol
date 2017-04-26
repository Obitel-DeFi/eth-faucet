pragma solidity ^0.4.8;
import "./Faucet.sol";
import "./ArrayUtils.sol";
import './zeppelin/lifecycle/Killable.sol';

contract FaucetManager is Killable {
  using ArrayUtils for *;

  mapping (address => address) creatorFaucetMapping;
  mapping (string => address) nameFaucetMapping;
  address[] public faucetAddresses;

  // Events
  event FaucetCreated(address _address, address _creatorAddress, string _name, uint _timeCreated);
  event FaucetDestroyed(address _address);

  // Fallback Function
  function() payable {}

  // Constructor
  function FaucetManager() payable {
  }

  // Modifiers
  modifier checkExistence(address _faucetAddress) {
    if (ArrayUtils.IndexOf(faucetAddresses, _faucetAddress) > faucetAddresses.length - 1)
      throw;
    _;
  }

  // Helper Functions
  function getFaucetByCreator() constant returns(address)  {
    return creatorFaucetMapping[msg.sender];
  }

  function getFaucetByName(string _name) constant returns(address)  {
    return nameFaucetMapping[_name];
  }

  function getFaucets() constant returns(address[] faucetAddresses)  {
    return faucetAddresses;
  }

  // Interface
	function createFaucet(string _name) payable returns (address) {
    // Validate Local State
    if (nameFaucetMapping[_name] != 0) {
      throw;
    }
    if (creatorFaucetMapping[msg.sender] != 0) {
      throw;
    }

    // Update Local State

    // Interact With Other Contracts
		Faucet _newFaucet = new Faucet(_name, msg.sender);
    if (!_newFaucet.send(msg.value)) {
      throw;
    }

    // Update State Dependent On Other Contracts
    faucetAddresses.push(address(_newFaucet));
    creatorFaucetMapping[msg.sender] = address(_newFaucet);
    nameFaucetMapping[_name] = address(_newFaucet);

    // Emit Events
    FaucetCreated(address(_newFaucet), msg.sender, _name, _newFaucet.timeCreated());
    return address(_newFaucet);
	}

  function requestAccess(address _requestorAddress, address _faucetAddress) checkExistence(_faucetAddress) {
    Faucet _faucet = Faucet(_faucetAddress);
    _faucet.addRequestorAddress(_requestorAddress);
  }

  function approveAccess(address _requestorAddress, address _faucetAddress) checkExistence(_faucetAddress) {
    Faucet _faucet = Faucet(_faucetAddress);
    _faucet.authorizeRequestorAddress(_requestorAddress);
  }

  function killFaucet(address _address, string _name, address _creator)  {
    // Validate Local State
    if (nameFaucetMapping[_name] == 0) {
      throw;
    }
    if ((_creator != msg.sender && this.owner() != msg.sender) || creatorFaucetMapping[_creator] == 0) {
      throw;
    }

    // Update Local State
    delete nameFaucetMapping[_name];
    delete creatorFaucetMapping[_creator];
    ArrayUtils.RemoveByValue(faucetAddresses, _address);

    // Interact With Other Contracts
    Faucet _faucet = Faucet(_address);
    _faucet.kill();

    // Emit Events
    FaucetDestroyed(_address);
  }
}
