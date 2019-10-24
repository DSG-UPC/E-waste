import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import RoleManager from "../truffle/build/contracts/RoleManager";
import { accounts } from '../web3';
import { selectContractInstance } from '../web3';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            loading: true,
            isNotary: false,
            isRepairer: false,
            isConsumer: false,
            isProcessor: false,
            isItad: false
        };
        this.redirectTo = this.redirectTo.bind(this);
    }

    async componentWillMount() {
        this.setState({ loading: false });
        this.setState({ account: window.ethereum.selectedAddress });
    }

    async createRoles(accs, manager) {
        await manager.addConsumer(accs.consumer, { from: this.state.account });
        await manager.addProducer(accs.producer, { from: this.state.account });
        await manager.addProcessor(accs.processor, { from: this.state.account });
        await manager.addRepairer(accs.repairer, { from: this.state.account });
        await manager.addItad(accs.itad, { from: this.state.account });
        await manager.addNotary(accs.notary, { from: this.state.account });
        console.log('llegue');
    }

    async updateRoleAssociated(manager) {
        let isNotary = await manager.isNotary(this.state.account);
        let isConsumer = await manager.isConsumer(this.state.account);
        let isRepairer = await manager.isRepairer(this.state.account);
        let isProcessor = await manager.isProcessor(this.state.account);
        let isItad = await manager.isItad(this.state.account);
        this.setState({
            account: this.state.account,
            isNotary: isNotary,
            isConsumer: isConsumer,
            isRepairer: isRepairer,
            isProcessor: isProcessor,
            isItad: isItad
        });
    }

    async redirectTo() {
        let accs = await accounts.then(i => {
            return {
                'consumer': i[0],
                'producer': i[1],
                'processor': i[2],
                'repairer': i[3],
                'itad': i[4],
                'notary': i[5],
            };
        });
        var manager = await selectContractInstance(RoleManager);
        let added = await manager.isConsumer(accs['consumer']);
        console.log('aqui llego');
        if (!added)
            await this.createRoles(accs, manager);
        await this.updateRoleAssociated(manager);
        console.log(this.state);
        if (this.state.isConsumer)
            this.props.history.push({
                pathname: "/consumer",
                state: {
                    account: this.state.account,
                    accounts: accs
                }
            });
        else if (this.state.isItad)
            this.props.history.push({
                pathname: "/itad",
                state: {
                    account: this.state.account,
                    accounts: accs
                }
            });
        else if (this.state.isProcessor)
            this.props.history.push({
                pathname: "/processor",
                state: {
                    account: this.state.account,
                    accounts: accs
                }
            });
        else if (this.state.isNotary)
            this.props.history.push({
                pathname: "/notary",
                state: {
                    account: this.state.account,
                    accounts: accs
                }
            });
        else if (this.state.isRepairer)
            this.props.history.push({
                pathname: "/repairer",
                state: {
                    account: this.state.account,
                    accounts: accs
                }
            });
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div id="load">
                    <img
                        src={require('../load.gif')}
                        alt="loading..."
                    />
                    <h1>Web3 is loading </h1>
                </div>
            );
        }
        return (
            <div id="home">
                <p>
                    We love our planet and we want to do whatever it is possible to save it.
                    Every year different tons of E-waste are generated worldwide. Only a small percentage is reused or
                    recycled.
                    We want to reduce this waste and we have crate this championship to raise awareness in people.
                </p>
                <h2> Would you enter in the E-Waste championship? </h2>
                <button onClick={this.redirectTo}>
                    Let's save the planet!
                </button>
            </div>
        );
    }
}
export default withRouter(Home);