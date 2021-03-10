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
        //if (!this.state.loading && this.state.endCountdown.length !== 1) {
            //corrigir codigo
            //this.state.contract.methods.totalVotes().call().then(totalVotes => {
                //if (totalVotes !== prevState.totalVotes) {
                    //this.setState({ totalVotes: totalVotes });
                //}
            //});
        //}
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

    updateCandidates = () => {
        this.setState({ candidates: [] });
        this.state.contract.methods.candidatesCount().call().then(candidatesCount => {
            for(let id = 0; id < candidatesCount; id++) {
                this.state.contract.methods.candidates(id).call().then(candidate => {
                    this.setState({ candidates: [...this.state.candidates, candidate] });
                });
            }
        });    
    }

    checkVoter = (IDnumber) => {
        this.setState({ lastError: '' });
        if (IDnumber) {
            this.setState({ IDnumberSelected: IDnumber });
            IDnumber = web3.utils.soliditySha3(sha256(IDnumber).toString());
            this.state.contract.methods.users(IDnumber).call().then(database => {
                database.userID ? this.setState({ loginPage: 2 }) : this.setState({ loginPage: 1 });
                this.setState({ databaseResults: database });
            });
        } else { this.setState({ lastError: 'Número de Identificação Civil inválido' }) }
    }

    getVoterAddress = (password, passwordConfirmation) => {
        this.setState({ lastError: '' });
        let IDnumber = this.state.IDnumberSelected;
        const currentTime = new Date().getTime();
        if (currentTime < this.state.endTime) {
            if (IDnumber) {
                if (password) {
                    if (password === passwordConfirmation) {
                        IDnumber = web3.utils.soliditySha3(sha256(this.state.IDnumberSelected).toString());
                        password = web3.utils.soliditySha3(sha256(password).toString());
                        if (this.state.databaseResults.userID) {
                            this.state.contract.methods.voters(this.state.databaseResults.voter).call().then(voters => {
                                if (!voters.voted) {
                                    parsePassword(this.state.databaseResults.voter, password);
                                } else { this.setState({ lastError: 'Já votou' }) }
                            });
                        } else {
                            const newAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
                            this.state.contract.methods.database(IDnumber, newAccount.address).estimateGas({ from: this.state.owner }).then(gasLimit => {
                                this.state.contract.methods.database(IDnumber, newAccount.address).send({ from: this.state.owner, gas: gasLimit }).then(() => {
                                    web3.eth.personal.importRawKey(newAccount.privateKey, password);
                                    web3.eth.sendTransaction({
                                        from: this.state.owner,
                                        gas: 21000, // Default gas for transactions
                                        to: newAccount.address,
                                        value: web3.utils.toWei('1', 'ether')
                                    });
                                    this.state.contract.methods.giveRightToVote(newAccount.address).send({ from: this.state.owner }).then(() => {
                                        parsePassword(newAccount.address, password);
                                    });
                                }).catch(() => { this.setState({ lastError: 'Já não podem votar mais utilizadores' }) });
                            }).catch(() => { this.setState({ lastError: 'Já não podem votar mais utilizadores' }) });
                        }
                    } else { this.setState({ lastError: 'As passwords não coincidem' }) }
                } else { this.setState({ lastError: 'Password inválida' }) }
            } else { this.setState({ lastError: 'Ocorreu um erro' }) }
        } else { this.setState({ lastError: 'Já não é possivel votar' }) }
        const parsePassword = (voter, password) => {
            web3.eth.personal.unlockAccount(voter, password, 1).then(() => {
                this.state.contract.methods.voters(voter).call().then(voters => {
                    voters.voted ? this.setState({ lastError: 'Já votou' }) : this.setState({ voter })
                });
            }).catch(() => { this.setState({ lastError: 'Password incorreta' }) })
        }
    }

    validateCandidate = (candidateID) => {
        this.setState({ lastError: '' });
        this.state.contract.methods.candidates(candidateID).call().then(candidate => {
            this.setState({ candidateID })
            this.setState({ candidateName: candidate.name });
            this.setState({ isCandidateValid: true });
        }).catch(() => {
            this.setState({ lastError: 'Candidato inválido' }) 
        });
    }

    makeVote = (voterAddress, voteIndex, password) => {
        password = web3.utils.soliditySha3(sha256(password).toString());
        this.setState({ lastError: '' });
        web3.eth.personal.unlockAccount(voterAddress, password).then(() => {
            this.state.contract.methods.vote(voteIndex).estimateGas({ from: voterAddress }).then(gasLimit => {
                this.state.contract.methods.vote(voteIndex).send({ from: voterAddress, gas: gasLimit }).then(() => {
                    this.state.contract.methods.totalVotes().call().then(totalVotes => {
                        sendEtherBack(voterAddress, password, this.state.owner);
                        this.setState({ totalVotes });
                        web3.eth.personal.lockAccount(voterAddress);
                        this.setState({ isVoteSuccessful: true });
                    });
                });
            });
        }).catch(() => { this.setState({ lastError: 'Password incorreta' }) });
        const sendEtherBack = (voter, voterPassword, owner) => {
            web3.eth.getBalance(voter).then(balance => {
                const totalToSpend = balance - this.state.gasPrice * 21000;
                web3.eth.personal.unlockAccount(voter, voterPassword).then(() => {
                    web3.eth.sendTransaction({
                        from: voter,
                        gas: 21000, // Default gas for transactions
                        to: owner,
                        value: totalToSpend
                    });
                });
            });
        }
    }

    logoutVoter = () => {
        this.setState({ voter: '' });
        this.setState({ votePage: 0 });
        this.setState({ loginPage: 0 });
        this.setState({ IDnumberSelected: '' });
        this.setState({ lastError: '' });
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
                this.setState({ endCountdown: ["O tempo para exercer o voto terminou"] });
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
            lastError: '',
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
                                                        lastError={this.state.lastError}
                                                        loginPage={this.state.loginPage}
                                                        IDnumberSelected={this.state.IDnumberSelected}
                                                        logoutVoter={this.logoutVoter}
                                                        checkVoter={this.checkVoter}
                                                        getVoterAddress={this.getVoterAddress}
                                                    /><p>&nbsp;</p></> }>
                                                </Route>
                                                <Route path="/vote" render={
                                                    () => <><Vote
                                                        lastError={this.state.lastError}
                                                        candidates={this.state.candidates}
                                                        voter={this.state.voter}
                                                        isCandidateValid={this.state.isCandidateValid}
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
