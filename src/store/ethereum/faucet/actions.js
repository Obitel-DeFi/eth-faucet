export const RECEIVE_FAUCET = 'RECEIVE_FAUCET'
export const RECEIVE_FAUCET_ADDRESSES = 'RECEIVE_FAUCET_ADDRESSES'
export const RECEIVE_FAUCET_OBJECTS = 'RECEIVE_FAUCET_OBJECTS'
export const FAUCET_CREATED = 'FAUCET_CREATED'
export const FAUCET_UPDATED = 'FAUCET_UPDATED'
export const SEND_WEI = 'SEND_WEI'

import {
  faucetManagerContractGetFaucetByCreator,
  faucetManagerContractGetFaucetByName,
  faucetManagerContractGetAllFaucetAddresses,
  faucetManagerContractGetAllFaucetObjects,
  faucetManagerContractCreateFaucet,
  faucetManagerContractRequestFaucetAccess,
  faucetManagerContractAuthorizeFaucetAccess,
  faucetManagerContractRevokeFaucetAccess,
  faucetContractSendWei
} from 'middleware/ethereum/faucet'

export const getFaucetByCreator = (_fromAddress) => {
  return (dispatch) => {
    faucetManagerContractGetFaucetByCreator(_fromAddress, (faucet) => {
      dispatch({
        type: RECEIVE_FAUCET,
        payload: faucet
      })
    })
  }
}

export const getFaucetByName = (_name) => {
  return (dispatch) => {
    faucetManagerContractGetFaucetByName(_name, (faucet) => {
      dispatch({
        type: RECEIVE_FAUCET,
        payload: faucet
      })
    })
  }
}

export const getAllFaucetAddresses = () => {
  return (dispatch) => {
    faucetManagerContractGetAllFaucetAddresses(addresses => {
      dispatch({
        type: RECEIVE_FAUCET_ADDRESSES,
        payload: addresses
      })
    })
  }
}

export const getAllFaucetObjects = () => {
  return (dispatch) => {
    faucetManagerContractGetAllFaucetObjects(faucets => {
      dispatch({
        type: RECEIVE_FAUCET_OBJECTS,
        payload: faucets
      })
    })
  }
}

export const requestFaucetAccess = (_faucetAddress, _requestorAddress, ) => {
  return (dispatch) => {
    faucetManagerContractRequestFaucetAccess(_faucetAddress, _requestorAddress, (_tx) => {
      dispatch({
        type: FAUCET_UPDATED,
        payload: _tx
      })
    })
  }
}

export const authorizeFaucetAccess = (_requestorAddress, _faucetAddress, _fromAddress) => {
  return (dispatch) => {
    faucetManagerContractAuthorizeFaucetAccess(_requestorAddress, _faucetAddress, _fromAddress, (_tx) => {
      dispatch({
        type: FAUCET_UPDATED,
        payload: _tx
      })
    })
  }
}

export const revokeFaucetAccess = (_requestorAddress, _faucetAddress) => {
  return (dispatch) => {
    faucetManagerContractRevokeFaucetAccess(_requestorAddress, _faucetAddress, (_tx) => {
      dispatch({
        type: FAUCET_UPDATED,
        payload: _tx
      })
    })
  }
}

export const createFaucet = (_name, _fromAddress) => {
  return (dispatch) => {
    faucetManagerContractCreateFaucet(_name, _fromAddress, (_tx) => {
      dispatch({
        type: FAUCET_CREATED,
        payload: _tx
      })
    })
  }
}

export const sendWei = (_faucetAddress, _recipientAddress, _fromAddress) => {
  return (dispatch) => {
    faucetContractSendWei(_faucetAddress, _recipientAddress, _fromAddress, (_tx) => {
      dispatch({
        type: FAUCET_UPDATED,
        payload: _tx
      })
    })
  }
}
