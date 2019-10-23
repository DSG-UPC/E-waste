import Web3 from 'web3';
import contract from 'truffle-contract';


// Web3.providers.WebsocketProvider.prototype.sendAsync = Web3.providers.WebsocketProvider.prototype.send

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

const web3 = new Web3(provider);
web3.eth.defaultAccount = web3.eth.accounts[0];

export default web3;

export const accounts = web3.eth.getAccounts().then(a => {
    return a;
});

export const selectContractInstance = (contractBuild) => {
    return new Promise(async res => {
        let myContract = await contract(contractBuild);
        myContract.setProvider(provider);
        myContract.defaults({
            gasLimit: "6721975"
        });
        myContract
            .deployed()
            .then(instance => res(instance));
    });
};
