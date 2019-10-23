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
            userAddress: '0x0'
        };
        this.redirectTo = this.redirectTo.bind(this);
    }

    async componentWillMount() {
        this.setState({ loading: false });
        this.setState({ account: window.ethereum.selectedAddress });
    }

    async createRoles(accs, manager) {
        var owner = accs.owner;
        await manager.addConsumer(accs.consumer, { from: owner });
        await manager.addProducer(accs.producer, { from: owner });
        await manager.addProcessor(accs.processor, { from: owner });
        await manager.addRepairer(accs.repairer, { from: owner });
        await manager.addItad(accs.itad, { from: owner });
        await manager.addNotary(accs.notary, { from: owner });
    }

    async redirectTo() {
        let accs = await accounts.then(i => {
            return {
                'owner': i[0],
                'consumer': i[1],
                'producer': i[2],
                'processor': i[3],
                'repairer': i[4],
                'itad': i[5],
                'notary': i[6],
            };
        });
        var manager = await selectContractInstance(RoleManager);
        this.createRoles(accs, manager);
        this.props.history.push({
            pathname: "/userPage",
            state: {
                account: this.state.account,
                accounts: accs
            }
        });
        // }
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