var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var Faucet = artifacts.require('./Faucet.sol')
var FaucetManager = artifacts.require('./FaucetManager.sol')
var _ = require('lodash')

contract('FaucetManager', function (accounts) {

  var faucetManagerInstance = null
  var faucetAddress = null
  var faucetCreator = accounts[0]
  var faucetRecipient = accounts[1]
  var faucetCustomer = accounts[2]
  var faucetName = 'austin-test-faucet'
  var faucetSeedEther = 5000000000000000000

  it('Factory Instance Exists', () => {
    return FaucetManager.deployed().then((_instance) => {
      faucetManagerInstance = _instance
    })
  })

  it('Verify Faucet Factory Addresses', (done) => {
    faucetManagerInstance.getFaucetByCreator.call({from: faucetCreator}).then((_faucetAddress) => {
      faucetAddress = _faucetAddress
      done()
    })
  })

  it('Create Faucet address', (done) => {
    faucetManagerInstance.createFaucet.call(faucetName, {
      from: faucetCreator,
      value: faucetSeedEther
    }).then((_address) => {
      faucetAddress = _address
      done()
    })
  })

  it('Create Faucet', (done) => {
    var events = faucetManagerInstance.FaucetCreated()

    events.watch((error, result) => {
      if (error == null) {
        assert.equal(faucetAddress, result.args._address, '_faucetAddress does not match faucetAddress')
        events.stopWatching()
        done()
      }
    })

    faucetManagerInstance.createFaucet(faucetName, {
      from: faucetCreator,
      gas: 2000000,
      value: faucetSeedEther
    }).then()
  })

  it('Verify Faucet address contained in FaucetManager addresses', () => {
    faucetManagerInstance.getFaucets().then((_faucetAddresses) => {
      assert(_.includes(_faucetAddresses, faucetAddress), '_faucetAddresses does not contain faucetAddress')
    })
  })

  it('Verify Faucet owner', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      return _faucet.owner.call().then((_owner) => {
        assert.equal(faucetManagerInstance.address, _owner, 'faucetManagerInstance is not faucet owner')
        done()
      })
    })
  })

  it('Verify faucetByCreatorMapping update', (done) => {
    faucetManagerInstance.getFaucetByCreator.call({from: faucetCreator}).then((_faucetAddress) => {
      assert.equal(_faucetAddress, faucetAddress, '_faucetAddress does not match faucetAddress')
      done()
    })
  })

  it('Verify nameFaucetMapping update', (done) => {
    faucetManagerInstance.getFaucetByName.call(faucetName, {from: faucetCreator}).then((_faucetAddress) => {
      assert.equal(_faucetAddress, faucetAddress, '_faucetAddress does not match faucetAddress')
      done()
    })
  })

  it('Verify Faucet Balance', (done) => {
    assert.equal(faucetSeedEther, web3.eth.getBalance(faucetAddress).toNumber(), '1000000000000000000 wasn\'t the faucet balance')
    done()
  })

  it('Verify Get Send Amount', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      return _faucet.getSendAmount.call({from: faucetCustomer})
    }).then((_sendAmount) => {
      assert.equal(1000000000000000000, _sendAmount.toNumber(), 'sendAmount wasn\'t 1000000000000000000')
      done()
    })
  })

  it('Verify Customer Can Request Access', (done) => {
    var events = faucetManagerInstance.AccessRequested()

    events.watch((error, result) => {
      if (error == null) {
        assert.equal(faucetCustomer, result.args.requestorAddress, 'Customer did not request access')
        events.stopWatching()
        done()
      }
    })

    faucetManagerInstance.requestAccess(faucetCustomer, faucetAddress, {
      from: faucetCustomer,
      gas: 2000000
    })
  })

  it('Verify Customer address contained in Faucet requestorAddresses', () => {
    Faucet.at(faucetAddress).then((_faucet) => {
      return _faucet.getRequestorAddresses.call()
    }).then((_requestorAddresses) => {
      assert(_.includes(_requestorAddresses, faucetCustomer), '_requestorAddresses does not contain faucetCustomer')
    })
  })

  it('Verify Creator Can Authorize Access', (done) => {
    var events = faucetManagerInstance.AuthorizationGranted()

    events.watch((error, result) => {
      if (error == null) {
        assert.equal(faucetCustomer, result.args.requestorAddress, 'Creator did not authorize access')
        events.stopWatching()
        done()
      }
    })

    faucetManagerInstance.authorizeAccess(faucetCustomer, faucetAddress, {
      from: faucetCreator,
      gas: 2000000
    })
  })

  it('Verify Customer address is authorized', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      return _faucet.isAddressAuthorized.call(faucetCustomer)
    }).then((_isAuthorized) => {
      assert(_isAuthorized, 'faucetCustomer is not authorized')
      done()
    })
  })

  it('Verify Customer Can Get Wei', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      var events = _faucet.EtherRequested()

      events.watch((error, result) => {
        if (error == null) {
          _faucet.isAddressAuthorized.call(faucetCustomer)
          .then((_isAuthorized) => {
            assert(_isAuthorized, 'faucetCustomer at all is not authorized')
            done()
          })
          assert.equal(1000000000000000000, result.args.sentAmount.toNumber(), 'Amount sent was not equal to 1000000000000000000')
          events.stopWatching()
        }
      })

      _faucet.getWei({from: faucetCustomer, gas: 2000000})
    })
  })

  it('Verify Customer Can Send Wei', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      var events = _faucet.EtherSent()

      events.watch((error, result) => {
        if (error == null) {
          assert.equal(faucetCustomer, result.args.toAddress, 'faucetCustomer was not sent wei')
          events.stopWatching()
          done()
        }
      })

      _faucet.sendWei(faucetRecipient, {from: faucetCustomer})
    })
  })

  it('Verify Creator Can Revoke Access', (done) => {
    var events = faucetManagerInstance.AuthorizationRevoked()

    events.watch((error, result) => {
      if (error == null) {
        assert.equal(faucetCustomer, result.args.requestorAddress, 'Creator did not revoke access')
        events.stopWatching()
        done()
      }
    })

    faucetManagerInstance.revokeAccess(faucetCustomer, faucetAddress, {
      from: faucetCreator,
      gas: 2000000
    })
  })

  it('Verify Customer address is not authorized', (done) => {
    Faucet.at(faucetAddress).then((_faucet) => {
      return _faucet.isAddressAuthorized.call(faucetCustomer)
    }).then((_isAuthorized) => {
      assert(!_isAuthorized, 'faucetCustomer is authorized')
      done()
    })
  })

  it('Destroy Faucet', () => {
    Faucet.at(faucetAddress).then((_faucet) => {
      faucetManagerInstance.killFaucet(_faucet.address, faucetName, faucetCreator, {from: faucetCreator}).then(() => {
        assert.equal(faucetManagerInstance.creatorFaucetMapping, null, 'creatorFaucetMapping was not undefined')
        assert.equal(faucetManagerInstance.nameFaucetMapping, null, 'nameFaucetMapping was not undefined')
      })
    })
  })
})
