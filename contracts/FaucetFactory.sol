pragma solidity ^0.4.8;
import "./Faucet.sol";
import './zeppelin/lifecycle/Killable.sol';

contract FaucetFactory is Killable {

  address[] faucetAddresses;
  mapping (address => address[]) faucetOwnerMapping;

  event FaucetCreated(address creatorAddress);

	function createFaucet() payable returns (address) {
		Faucet newFaucet = new Faucet();
    if (!newFaucet.send(msg.value)) {
      throw;
    }
    faucetAddresses.push(address(newFaucet));
    faucetOwnerMapping[msg.sender].push(address(newFaucet));
    FaucetCreated(msg.sender);
    return address(newFaucet);
	}

  function getAllFaucets() constant returns(address[] faucetAddresses)  {
    return faucetOwnerMapping[msg.sender];
  }
}
