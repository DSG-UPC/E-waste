import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { accounts, selectContractInstance } from '../web3';
import RoleManager from "../truffle/build/contracts/RoleManager";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: window.ethereum.selectedAddress,
            loading: true,
            accounts: [],
            isNotary: false,
            isConsumer: false,
            isRepairer: false
        };
        this.redirectTo = this.redirectTo.bind(this);
        this.updateCurrentRole = this.updateCurrentRole.bind(this);
    }

    async componentWillMount() {
        this.roleManager = await selectContractInstance(RoleManager);
        this.setState({ loading: false });
        this.setState({ account: window.ethereum.selectedAddress });
    }

    async updateCurrentRole() {
        let is_notary = await this.roleManager.isNotary(this.state.account);
        let is_consumer = await this.roleManager.isConsumer(this.state.account);
        let is_repairer = await this.roleManager.isRepairer(this.state.account);
        this.setState({
            isNotary: is_notary,
            isConsumer: is_consumer,
            isRepairer: is_repairer
        });
    }

    async redirectTo() {
        let accs = await accounts.then(i => {
            return {
                'notary': i[0],
                'repairer': i[1],
                'consumer': i[2]
            };
        });
        let curr_state = {
            account: this.state.account,
            accounts: accs
        };
        await this.updateCurrentRole();
        if (this.state.isConsumer) {
            this.props.history.push({
                pathname: "/consumer",
                state: curr_state
            });
        }
        else if (this.state.isNotary) {
            this.props.history.push({
                pathname: "/notary",
                state: curr_state
            });
        }
        else if (this.state.isRepairer) {
            this.props.history.push({
                pathname: "/repairer",
                state: curr_state
            });
        }
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