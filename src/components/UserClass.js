import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import web3, { selectContractInstance } from '../web3';
import DeviceFactory from "../truffle/build/contracts/DeviceFactory";
import DepositDevice from "../truffle/build/contracts/DepositDevice";

// import { declareVariable } from '@babel/types';

class UserClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: props.location.state.account,
            accounts: props.location.state.accounts,
            dev: [],
            deviceName: '',
            initialPrice: 0,
            destination: '0x0'
        };

        this.insertDevice = this.insertDevice.bind(this);
        this.checkDevices = this.checkDevices.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDestination = this.handleDestination.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
        this.transfer = this.transfer.bind(this);
        this.handleBuyer = this.handleBuyer.bind(this);
        this.handleUri = this.handleUri.bind(this);
    }

    async componentDidMount() {
        this.factory = await selectContractInstance(DeviceFactory);
        console.log(this.factory.address)
        this.setState({ account: this.props.location.state.account });
        await this.checkDevices();
    }

    async checkDevices() {
        var devices = await this.factory.getDeployedDevices({ from: this.state.account });
        let n = devices.length;
        if (this.state.dev.length !== n) {
            devices = [];
            for (let i = 0; i < n; i++) {
                let d = await DepositDevice(devices[i]);
                var task = {
                    'name': d[i].name,
                    'owner': d[i].owner,
                    'address': d[i].address,
                    'value': d[i].value,
                    'role': ''
                };
                devices.push(task);
            }
            this.setState({
                dev: [devices]
            });
        }
    }

    async insertDevice() {
        try {
            await this.factory.createDevice(
                this.state.deviceName,
                this.state.initialPrice,
                web3.utils.toChecksumAddress(this.state.destination),
                { from: this.state.account }
            )
                .then(function (err, ret) {
                    console.log("ret " + ret);
                    console.log("err " + err);
                });
        } catch (e) {
            console.log(e);
        }
        await this.checkDevices(1);
    }

    async transfer(_tokenID, _to) {
        await this.traceability.transferFrom(this.state.account, _to, _tokenID, { from: this.state.account })
            .then(function (err, ret) {
                console.log("ret " + ret);
                console.log("err " + err);
            });
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

    handleBuyer(event) {
        this.setState({ buyer: event.target.value });
    }

    handleUri(event) {
        this.setState({ deviceUri: event.target.value });
    }

    handleTransfer(event) {
        alert('A device is going to be transferred ');
        event.preventDefault();
        if (this.state.deviceUri === '' || this.state.buyer === '0x0') {
            alert('Device Uri and To must be not empty');
            return null;
        } else {
            for (let i = 0; i < this.state.noDev; i++) {
                if (this.state.dev[i][2] === this.state.deviceUri) {
                    this.transfer(this.state.dev[i][3], this.state.buyer).then(res => {
                        console.log(res);
                    });
                }
            }
        }
    }


    handleSubmit(event) {
        alert('A  new device was submitted: ');
        event.preventDefault();
        this.insertDevice()
            .then(ret => {
                console.log(ret);
            });
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
                    {(this.state.dev.length !== 0) ?
                        <div >
                            <div className="transfer">
                                <form >
                                    <label>
                                        Device Uri:
                                        <input
                                            name="deviceUri"
                                            type="text"
                                            value={this.state.deviceUri}
                                            onChange={this.handleUri}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        To:
                                        <input
                                            name="buyer"
                                            type="text"
                                            placeholder="Address"
                                            onChange={this.handleBuyer}
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
                                    this.state.dev.map((dev) => {
                                        return (
                                            <div key={String(dev[2])} className="list-element">
                                                <label> Device name: {dev.name} </label>
                                                <br />
                                                <label> Device initial value: {dev.value} </label>
                                                <br />
                                                <label> Device Address: {dev.address} </label>
                                                <br />
                                                <label> Device Owner: {dev[4]} </label>
                                                <br />
                                                <label> Device Role: {dev[2]} </label>
                                            </div>
                                        );
                                    })}
                            </ul>
                        </div> :
                        <label>You don't have any device registered yet </label>
                    }
                </div>
                <div> </div> :
                    <div className="device-form">
                    <form>
                        <label>
                            Device name:
                                <br />
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
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(UserClass);