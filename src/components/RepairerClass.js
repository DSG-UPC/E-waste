
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import web3, { selectContractInstance } from '../web3';
import DeviceFactory from "../truffle/build/contracts/DeviceFactory";
import DepositDevice from "../truffle/build/contracts/DepositDevice";

// import { declareVariable } from '@babel/types';

class RepairerClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: props.location.state.account,
            accounts: props.location.state.accounts,
            dev: [],
            deviceName: '',
            initialPrice: 0,
            destination: '0x0',
            deviceAddress: '0x0'
        };

        this.checkDevices = this.checkDevices.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDestination = this.handleDestination.bind(this);
        this.handleDeviceAddress = this.handleDeviceAddress.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.transfer = this.transfer.bind(this);
    }

    async componentDidMount() {
        this.factory = await selectContractInstance(DeviceFactory);
        await this.checkDevices();
    }

    async checkDevices() {
        var deployed_devices = await this.factory.getDeployedDevices({ from: this.state.account });
        var n = deployed_devices.length;
        if (this.state.dev.length !== n) {
            var devices = [];
            for (let i = 0; i < n; i++) {
                let d = await new web3.eth.Contract(DepositDevice.abi, deployed_devices[i]);
                var task = await this.getContractData(d);
                devices.push(task);
            }
            this.setState({
                dev: devices
            });
        }
    }

    async getContractData(contract) {
        let name = await contract.methods.getName().call().then(res => { return res; });
        let owner = await contract.methods.getOwner().call().then(res => { return res; });
        let value = await contract.methods.getValue().call().then(res => { return res; });
        let addr = await contract._address;

        return {
            'name': name,
            'owner': owner,
            'price': value,
            'address': addr
        };
    }

    async transfer(d, _to) {
        await this.factory.transferDevice(web3.utils.toChecksumAddress(d.address),
            web3.utils.toChecksumAddress(_to),
            { from: this.state.account });
        this.checkDevices();
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

    handleDeviceAddress(event) {
        this.setState({ deviceAddress: event.target.value });
    }

    isInvalid() {
        return this.state.deviceAddress === '0x0' ||
            this.state.destination === '0x0' ||
            this.state.accounts.consumer !== this.state.destination;
    }

    handleTransfer(event) {
        alert('A device is going to be transferred ');
        event.preventDefault();
        if (this.isInvalid()) {
            alert('The device cannot be sent to that address');
            return null;
        } else {
            let d = this.state.dev.find(a => { return a.address === this.state.deviceAddress; });
            this.transfer(d, this.state.destination).then(res => {
                console.log(res);
            });
        }
    }

    renderListDevices() {
        return (
            (this.state.dev.length !== 0) ?
                <div >
                    <div className="transfer">
                        <form >
                            <label>
                                Device Address:
                                        <input
                                    name="deviceAddress"
                                    type="text"
                                    value={this.state.deviceAddress}
                                    onChange={this.handleDeviceAddress}
                                />
                            </label>
                            <br />
                            <label>
                                To:
                                        <input
                                    name="destination"
                                    type="text"
                                    placeholder="Address"
                                    onChange={this.handleDestination}
                                />
                            </label>
                            <br />
                            <button
                                onClick={this.handleTransfer}
                            >Transfer</button>
                        </form>
                    </div>
                    <ul>
                        {
                            this.state.dev.map((d) => {
                                return (
                                    <li key={String(d.address)} className="list-element">
                                        <label> Device name: {d.name} </label>
                                        <br />
                                        <label> Device initial value: {d.price} </label>
                                        <br />
                                        <label> Device Address: {String(d.address)} </label>
                                        <br />
                                    </li>
                                );
                            })}
                    </ul>
                </div> :
                <label>You don't have any device registered yet </label>
        )
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
                <div className="device-list">
                    {
                        this.renderListDevices()
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(RepairerClass);