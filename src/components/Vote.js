import React, { Component, lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Link, Redirect } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';

const CandidateSelection = lazy(() => import('./votePages/CandidateSelection'));
const CandidateConfirmation = lazy(() => import('./votePages/CandidateConfirmation'));
const VoteProcess = lazy(() => import('./votePages/VoteProcess'));
const VoteResult = lazy(() => import('./votePages/VoteResult'));

class Vote extends Component {

    componentDidMount() {
        if (!this.props.voter && this.props.endCountdown.length !== 1) {
            this.redirectLogin = setTimeout(() => { this.setRedirectAuto(true) }, 3000);
        } 
    }

    componentDidUpdate() {
        if (!this.props.voter && this.props.endCountdown.length === 1) {
            this.setRedirectAuto(true);
        }
    }

    componentWillUnmount () {
        clearInterval(this.redirectLogin)
    }

    setRedirectAuto = (state) => {
        this.setState({ redirectAuto: state });
    }

    constructor(props) {
        super(props);
        this.state = {
            redirectAuto: false
        }
    }
    
    render() {
        if (!this.props.voter) {
            if (this.state.redirectAuto) {
                return <Redirect to="/" />
            } else {
                return (
                    <>
                        <h2>Não autorizado</h2>
                        <p>
                            Será redirecionado dentro de 3 segundos
                            <br></br>
                            ou também pode clicar <Link to="/">aqui</Link>
                        </p>
                    </>
                )
            }
        } else {
            switch(this.props.votePage) {
                case 1:
                    return (
                        <>
                            <ProgressBar animated now="33" label="33%" />
                            <br></br>
                            <Suspense fallback={<LoadingSpinner />}>
                                <CandidateConfirmation
                                    updateVotePage={this.props.updateVotePage}
                                    candidateName={this.props.candidateName}
                                />
                            </Suspense>
                        </>
                    );
                case 2:
                    return (
                        <>
                            <ProgressBar animated now="66" label="66%" />
                            <br></br>
                            <Suspense fallback={<LoadingSpinner />}>
                                <VoteProcess
                                    candidateName={this.props.candidateName}
                                    candidateID={this.props.candidateID}
                                    makeVote={this.props.makeVote}
                                    voter={this.props.voter}
                                    lastError={this.props.lastError}
                                />
                            </Suspense>
                        </>
                    );
                case 3:
                    return (
                        <>
                            <ProgressBar animated now="100" label="100%" />
                            <br></br>
                            <Suspense fallback={<LoadingSpinner />}>
                                <VoteResult
                                    candidateName={this.props.candidateName}
                                    logoutVoter={this.props.logoutVoter}
                                    setRedirectAuto={this.setRedirectAuto}
                                />
                            </Suspense>
                        </>
                    );
                default:
                    return (
                        <>
                            <ProgressBar animated now="0" />
                            <br></br>
                            <Suspense fallback={<LoadingSpinner />}>
                                <CandidateSelection
                                    validateCandidate={this.props.validateCandidate}
                                    lastError={this.props.lastError}
                                    candidates={this.props.candidates}
                                />
                            </Suspense>
                        </>
                    );
            }
        }
    }
}

export default Vote;
