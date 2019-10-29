
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import web3, { selectContractInstance } from '../web3';
import DeviceFactory from "../truffle/build/contracts/DeviceFactory";

class NotaryClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: props.location.state.account,
            deviceName: '',
            initialPrice: 0,
            destination: '0x0'
        };

        this.insertDevice = this.insertDevice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDestination = this.handleDestination.bind(this);
    }

    async componentDidMount() {
        this.factory = await selectContractInstance(DeviceFactory);
    }

    async insertDevice() {
        await this.factory.createDevice(
            this.state.deviceName,
            this.state.initialPrice,
            web3.utils.toChecksumAddress(this.state.destination),
            { from: this.state.account }
        );
        
    }

    handleName(event) {
        this.setState({ deviceName: event.target.value });
    }

    handlePrice(event) {
        this.setState({ initialPrice: event.target.value });
    }

    handleDestination(event) {
        this.setState({ destination: event.target.value });
    }


    handleSubmit(event) {
        alert('A  new device was submitted: ');
        event.preventDefault();
        this.insertDevice();
    }

    renderAddDevice() {
        return (<form>
            <label>
                Device name:
                    <br/>
                <input
                    name="deviceName"
                    type="text"
                    value={this.state.deviceName}
                    onChange={this.handleName}
                />
            </label>
            <br />
            <label>
                Initial price (in Wei):
                    <br />
                <input
                    name="price"
                    type="number"
                    value={this.state.initialPrice}
                    onChange={this.handlePrice}
                />
            </label>
            <br />
            <label>
                Destination address:
                    <br />
                <input
                    name="destination"
                    type="text"
                    value={this.state.destination}
                    onChange={this.handleDestination}
                />
            </label>
            <br />
            <button onClick={this.handleSubmit}>
                Insert device
                </button>
        </form>);
    }

    render() {
        return (
            <div className="User_class">
                <header>
                    <button onClick={() => this.props.history.push({
                        pathname: "/",
                        state: {
                            account: this.state.account
                        }
                    })}>
                        Home
                    </button>
                </header>
                <br />
                <div className="device-form">
                    {
                        this.renderAddDevice()
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(NotaryClass);