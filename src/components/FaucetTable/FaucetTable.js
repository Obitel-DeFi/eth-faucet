import React from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

class FaucetTable extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      fixedHeader: false,
      showFooter: false,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: 'auto',
      dialogOpen: false,
      selectedObject: null
    }
  }

  onRowSelection = (index) => {
    var selectedObject = this.props.faucetObjects[index]
    if (selectedObject) {
      this.setState({
        dialogOpen: false,
        selectedObject: selectedObject
      })
    }
    this.props.selectRow(selectedObject);
  }

  renderTableHeaderFooter() {
    return (
      <TableRow>
        <TableHeaderColumn tooltip='Balane'>Balance</TableHeaderColumn>
        <TableHeaderColumn tooltip='Name'>Name</TableHeaderColumn>
        <TableHeaderColumn tooltip='Address'>Address</TableHeaderColumn>
      </TableRow>
    )
  }

  handleCloseDialog = () => {
    this.setState({
      dialogOpen: false,
      selectedObject: null
    })
  }


  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused
        onTouchTap={this.acceptLoan}
      />
    ]
    return (
      <div>
        <Table
          height={this.state.height}
          onRowSelection={this.onRowSelection}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          bodyStyle={{ overflow: 'visible' }}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            {this.renderTableHeaderFooter()}
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.props.faucetObjects.map((faucet, index) => (
              <TableRow key={index}>
                <TableRowColumn>{faucet.balance}</TableRowColumn>
                <TableRowColumn>{faucet.name}</TableRowColumn>
                <TableRowColumn>{faucet.address}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog
          title='Grant Access?'
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleCloseDialog}
        >
          Are you sure you want to grant {this.state.selectedObject !== null && this.state.selectedObject} access to this faucet?
        </Dialog>
      </div>
    )
  }
}

export default FaucetTable
