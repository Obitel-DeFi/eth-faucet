import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class CreateFaucetForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            faucetName: '',
            expanded: true,
        };
    }

    handleExpandChange = (expanded) => {
        this.setState({ expanded: expanded });
    };

    handleToggle = (event, toggle) => {
        this.setState({ expanded: toggle });
    };

    handleExpand = () => {
        this.setState({ expanded: true });
    };

    handleReduce = () => {
        this.setState({ expanded: false });
    };

    handleCreate = () => {
        console.log('create new faucet...')
    };

    handleLoadFaucet = () => {
        console.log(this)
        this.props.onGetAllFaucets();
    }

    handleCreateFaucet = () => {
        console.log(this.state)
        this.props.onCreateFaucetFormSubmit();
    }

    onInputChange(event) {
        this.setState({
            faucetName: event.target.value
        });
    }

    render() {
        return (

            <div>
                <TextField
                    id="text-field-controlled"
                    floatingLabelText="Name"
                    value={this.state.value}
                    errorText={this.state.error}
                    onChange={e => this.onInputChange(e)}
                />
                <br />
                <RaisedButton onClick={this.handleLoadFaucet} label="Load" />
                <RaisedButton onClick={this.handleCreateFaucet} label="Create" />
            </div>

        );
    }
}