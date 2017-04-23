import React from 'react';
import { connect } from 'react-redux'
import Faucet from '../components/Faucet'
import { sendWei } from '../actions/faucet'

const mapStateToProps = (state, ownProps) => {
  return {
    faucet: state.faucet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSendWeiFormSubmit: (_faucetAddress, _recipientAddress) => {
      event.preventDefault();
      sendWei(_faucetAddress, _recipientAddress)
    }
  }
}

const FaucetContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Faucet)

export default FaucetContainer
