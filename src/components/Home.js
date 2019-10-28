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
        console.log(this.roleManager)
        this.setState({ loading: false });
        this.setState({ account: window.ethereum.selectedAddress });
    }

    async updateCurrentRole() {
        let is_notary = await this.roleManager.isNotary(this.state.account, {from: this.state.account});
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
                <h1>Usody Software</h1>
                <h2>For a Circular Economy of Electronics</h2>
            
                <button onClick={this.redirectTo}>
                Access Device Life cycle Management
                </button>
            </div>
        );
    }
}
export default withRouter(Home);