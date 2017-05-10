import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'

import CircularProgress from 'material-ui/CircularProgress'

import { has } from 'lodash'

export default class Faucet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      defaultAddress: '',
      selectedAddress: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      selectedAddress: this.props.web3.defaultAddress,
      defaultAddress: this.props.web3.defaultAddress
    })
  }

  handleSendWei = () => {
    if (this.isOwner || this.hasAccess(this.state.defaultAddress)) {
      this.props.onSendWeiFormSubmit(this.props.faucet.selected.address, this.state.selectedAddress, this.state.defaultAddress)
    }
  }

  handleRequestAccess = () => {
    if (!this.isOwner && !this.hasRequestedAccess(this.state.selectedAddress)) {
      this.props.onRequestFaucetAccess(this.props.faucet.selected.address, this.state.selectedAddress, this.state.defaultAddress)
    }
  }

  handleNavigateToAdmin = () => {
    if (this.isOwner()) {
      let path = '/faucets/' + this.props.faucet.selected.name + '/authorize-users'
      this.props.onNavigateToPath(path)
    }
  }

  hasRequestedAccess = (address) => {
    return has(this.props.faucet.authorizedAddressReadModel, address)
  }

  hasAccess = (address) => {
    return this.hasRequestedAccess(address) &&
      this.props.faucet.authorizedAddressReadModel[address] === 'Granted'
  }

  isOwner = () => {
    return this.props.faucet.isOwner
  }

  onInputChange (event) {
    this.setState({
      selectedAddress: event.target.value
    })
  }

  render () {
    const { selected } = this.props.faucet

    const isLoaded = () => {
      return selected && this.props.faucet.authorizedAddressReadModel !== null
    }

    if (!isLoaded()) {
      return (
        <div style={{textAlign: 'center'}}>
          <CircularProgress mode='indeterminate' size={80} />
        </div>
      )
    } else {
      return (
        <Card>
          {selected &&
            <CardTitle
              title={selected.name + ' Faucet'} style={{ 'textTransform': 'capitalize' }}
              subtitle={'Balance: ' + selected.balance + ' Ether'}
              />
          }
          <CardText>
            <TextField
              style={{ width: '100%' }}
              id='text-field-controlled'
              floatingLabelText='Address'
              value={this.state.selectedAddress}
              errorText={this.state.error}
              onChange={e => this.onInputChange(e)}
              />
            <br />
          </CardText>

          <CardActions style={{ textAlign: 'right' }}>
            {
              this.isOwner() &&
              <RaisedButton
                primary
                onClick={this.handleNavigateToAdmin}
                label='Admin' />
            }
            {
              !this.isOwner() && !this.hasRequestedAccess(this.state.defaultAddress) &&
              <RaisedButton
                primary
                onClick={this.handleRequestAccess}
                label='Request Access' />
            }
            {
              this.isOwner() || this.hasAccess(this.state.defaultAddress) &&
              <RaisedButton
                secondary
                style={{ marginRight: '0px' }}
                onClick={this.handleSendWei}
                label='Request 1 Ether' />
            }
          </CardActions>
        </Card>
      )
    }
  }
}
