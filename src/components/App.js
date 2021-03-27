import React, { Component, lazy, Suspense } from 'react';
import Web3 from 'web3';
import Ballot from '../abis/Ballot.json';
import sha256 from 'crypto-js/sha256';
import LoadingSpinner from './LoadingSpinner';
import NavigationBar from './NavigationBar';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Welcome = lazy(() => import('./Welcome'));
const Login = lazy(() => import('./Login'));
const Vote = lazy(() => import('./Vote'));
const NotFound = lazy(() => import('./NotFound'));
const Results = lazy(() => import('./Results'));
const web3 = new Web3("ws://localhost:8545");

class App extends Component {

    async componentDidMount() {
        await this.loadBlockchainData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isCandidateValid) {
            this.setState({ votePage: 1 });
            this.setState({ isCandidateValid: false });
        }
        if (this.state.isVoteSuccessful) {
            this.setState({ votePage: 3 });
            this.setState({ isVoteSuccessful: false });
        }
        if (this.state.startCountdown !== prevState.startCountdown) {
            this.countdown();
        }
    }
    
    async loadBlockchainData() {
        const accounts = await web3.eth.getAccounts();
        this.setState({ owner: accounts[0] });
        const gasPrice = await web3.eth.getGasPrice();
        this.setState({ gasPrice });
        const networkID = await web3.eth.net.getId()
        const networkData = Ballot.networks[networkID]
        if(networkData) {
            const contract = new web3.eth.Contract(Ballot.abi, networkData.address);
            this.setState({ contract });
            const endTime = await contract.methods.endTime().call();
            this.setState({ endTime: Number(endTime * 1000) });
            this.setState({ startCountdown: true })
            const totalVotes = await contract.methods.totalVotes().call();
            this.setState({ totalVotes });
            const maxUsers = await contract.methods.maxUsers().call();
            this.setState({ maxUsers: Number(maxUsers) });
            const candidatesCount = await contract.methods.candidatesCount().call();
            this.setState({ candidatesCount })
            for(let id = 0; id < candidatesCount; id++) {
                const candidate = await contract.methods.candidates(id).call();
                this.setState({ candidates: [...this.state.candidates, candidate] });
            }
            this.setState({ loading: false });
        } else {
            window.alert(Ballot.contractName + ' not deployed to detected network.')
        };
    }
    
    updateVotePage = (pageIndex) => {
        this.setState({ votePage: pageIndex })
    }

    updateCandidates = async () => {
        this.setState({ candidates: [] });
        const candidatesCount = await this.state.contract.methods.candidatesCount().call();
        for(let id = 0; id < candidatesCount; id++) {
            const candidate = await this.state.contract.methods.candidates(id).call()
            this.setState({ candidates: [...this.state.candidates, candidate] });
        }
    }

    checkVoter = async (IDnumber) => {
        //if (IDnumber) { //verificar se condicao if necessaria
            let error;
            this.setState({ IDnumberSelected: IDnumber });
            IDnumber = web3.utils.soliditySha3(sha256(IDnumber).toString());
            const database = await this.state.contract.methods.users(IDnumber).call();
            if (database.userID) {
                this.setState({ loginPage: 2 });
            } else {
                const currentUsers = await this.state.contract.methods.currentUsers().call();
                currentUsers < this.state.maxUsers ? this.setState({ loginPage: 1 }) : error = 'Já não é possível votar';
            }
            this.setState({ databaseResults: database });
            return error;
        //}
    }

    getVoterAddress = async (password) => {
        const parsePassword = async (voter, password) => {
            return web3.eth.personal.unlockAccount(voter, password, 1).then(async () => {
                const voters = await this.state.contract.methods.voters(voter).call();
                return voters.voted ? 'O eleitor ja votou' : this.setState({ voter });
            }).catch(() => { return 'A password introduzida está incorreta' });
        }
        let IDnumber = this.state.IDnumberSelected;
        //const currentTime = new Date().getTime(); //verificar se necessaria
        //if (currentTime < this.state.endTime) { //verificar se condicao if necessaria
            //if (password === passwordConfirmation) {
                IDnumber = web3.utils.soliditySha3(sha256(this.state.IDnumberSelected).toString());
                password = web3.utils.soliditySha3(sha256(password).toString());
                if (this.state.databaseResults.userID) {
                    const voters = await this.state.contract.methods.voters(this.state.databaseResults.voter).call();
                    return !voters.voted ? parsePassword(this.state.databaseResults.voter, password) : 'O eleitor ja votou'
                } else {
                    const newAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
                    return this.state.contract.methods.database(IDnumber, newAccount.address).estimateGas({ from: this.state.owner }).then(gasLimit => {
                        this.state.contract.methods.database(IDnumber, newAccount.address).send({ from: this.state.owner, gas: gasLimit }).then(() => {
                            web3.eth.personal.importRawKey(newAccount.privateKey, password);
                            web3.eth.sendTransaction({ from: this.state.owner, gas: 21000, to: newAccount.address, value: web3.utils.toWei('1', 'ether') });
                            return this.state.contract.methods.giveRightToVote(newAccount.address).send({ from: this.state.owner }).then(() => {
                                return parsePassword(newAccount.address, password);
                            });
                        }).catch(() => { return 'Já não podem votar mais utilizadores' });
                    }).catch(() => { return 'Já não podem votar mais utilizadores' });
                }
            //}
        //} else { return 'Já não podem votar mais utilizadores' }
    }

    validateCandidate = async (candidateID) => {
        const candidate = await this.state.contract.methods.candidates(candidateID).call();
        this.setState({ candidateID });
        this.setState({ candidateName: candidate.name });
        this.setState({ isCandidateValid: true });
    }

    makeVote = async (voterAddress, voteIndex, password) => {
        const sendEtherBack = async (voter, owner, password) => {
            const voterBalance = await web3.eth.getBalance(voter)
            const totalToSpend = voterBalance - this.state.gasPrice * 21000;
            web3.eth.personal.sendTransaction({ from: voter, gas: 21000, to: owner, value: totalToSpend }, password);
            web3.eth.personal.lockAccount(voter);
        }
        password = web3.utils.soliditySha3(sha256(password).toString());
        return web3.eth.personal.unlockAccount(voterAddress, password, 1).then(async () => {
            this.state.contract.methods.vote(voteIndex).estimateGas({ from: voterAddress }).then(gasLimit => {
                this.state.contract.methods.vote(voteIndex).send({ from: voterAddress, gas: gasLimit }).then(async () => {
                    const totalVotes = await this.state.contract.methods.totalVotes().call();
                    sendEtherBack(voterAddress, this.state.owner, password);
                    this.setState({ totalVotes });
                    this.setState({ isVoteSuccessful: true });
                });
            });
        }).catch(() => { return 'A password introduzida está incorreta' })
    }

    logoutVoter = () => {
        this.setState({ voter: '' });
        this.setState({ votePage: 0 });
        this.setState({ loginPage: 0 });
        this.setState({ IDnumberSelected: '' });
    }

    countdown = () => {
        const countdown = setInterval(() => { makeCountdown() }, 1000);
        const makeCountdown = () => {
            const currentTime = new Date().getTime();
            const endVoteTime = this.state.endTime - currentTime;
            const hours = Math.floor((endVoteTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((endVoteTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((endVoteTime % (1000 * 60)) / 1000);
            this.setState({ endCountdown: [hours, minutes, seconds] })
            if (hours <= 0 && minutes <= 0 && seconds <= 0) {
                clearInterval(countdown);
                this.setState({ endCountdown: ['O tempo para exercer o voto terminou'] });
                this.setState({ voter: '' });
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            owner: '',
            contract: null,
            voter: '',
            totalVotes: 0,
            maxUsers: 0,
            candidatesCount: 0,
            databaseResults: null,
            loginPage: 0,
            IDnumberSelected: '',
            votePage: 0,
            candidateName: '',
            candidateID: null,
            candidates: [],
            endTime: 0,
            startCountdown: false,
            endCountdown: [],
            isVoteSuccessful: false,
            isCandidateValid: false,
            loading: true
        }
    }
    
    render() {
        return (
            <Router>
                <NavigationBar endCountdown={this.state.endCountdown} />
                    <div className="container-fluid mt-5">
                        <div className="row">
                            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                                <div className="content text-center">
                                    { this.state.loading
                                        ? <LoadingSpinner />
                                        : <Suspense fallback={<LoadingSpinner />}>
                                            <Switch>
                                                <Route exact path="/" render={
                                                    () => <><Welcome
                                                        votePage={this.state.votePage}
                                                        candidates={this.state.candidates}
                                                        totalVotes={this.state.totalVotes}
                                                        voter={this.state.voter}
                                                    /><p>&nbsp;</p></> }>
                                                </Route>
                                                <Route path="/login" render={
                                                    () => <><Login
                                                        voter={this.state.voter}
                                                        loginPage={this.state.loginPage}
                                                        IDnumberSelected={this.state.IDnumberSelected}
                                                        logoutVoter={this.logoutVoter}
                                                        checkVoter={this.checkVoter}
                                                        getVoterAddress={this.getVoterAddress}
                                                        endCountdown={this.state.endCountdown}
                                                    /><p>&nbsp;</p></> }>
                                                </Route>
                                                <Route path="/vote" render={
                                                    () => <><Vote
                                                        candidates={this.state.candidates}
                                                        voter={this.state.voter}
                                                        candidateID={this.state.candidateID}
                                                        makeVote={this.makeVote}
                                                        candidateName={this.state.candidateName}
                                                        validateCandidate={this.validateCandidate}
                                                        updateVotePage={this.updateVotePage}
                                                        votePage={this.state.votePage}
                                                        logoutVoter={this.logoutVoter}
                                                        endCountdown={this.state.endCountdown}
                                                    /><p>&nbsp;</p></> }>
                                                </Route>
                                                <Route path="/results" render={
                                                        () => <><Results
                                                            totalVotes={this.state.totalVotes}
                                                            candidatesCount={this.state.candidatesCount}
                                                            endCountdown={this.state.endCountdown}
                                                            candidates={this.state.candidates}
                                                            maxUsers={this.state.maxUsers}
                                                            updateCandidates={this.updateCandidates}
                                                        /><p>&nbsp;</p></> }>
                                                </Route>
                                                <Route path="*" render={ props => <><NotFound {...props} /><p>&nbsp;</p></> }></Route>
                                            </Switch>
                                        </Suspense>
                                    }
                                </div>
                            </main>
                        </div>
                    </div>
            </Router>
        )
    }
}

export default App;
