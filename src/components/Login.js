import React, { Component, lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Redirect } from "react-router-dom";

const DetectAccount = lazy(() => import('./loginPages/DetectAccount'));
const CreateAccount = lazy(() => import('./loginPages/CreateAccount'));
const LoginAccount = lazy(() => import('./loginPages/LoginAccount'));

class Login extends Component {
    render() {
        const { voter } = this.props;
        if (voter) { return <Redirect to="/" /> }
        switch(this.props.loginPage) {
            case 1:
                return (
                    <>
                        <Suspense fallback={<LoadingSpinner />}>
                            <CreateAccount
                                logoutVoter={this.props.logoutVoter}
                                getVoterAddress={this.props.getVoterAddress}
                                lastError={this.props.lastError}
                                IDnumberSelected={this.props.IDnumberSelected}
                            />
                        </Suspense>
                    </>
                );
            case 2:
                return (
                    <>
                        <Suspense fallback={<LoadingSpinner />}>
                            <LoginAccount
                                logoutVoter={this.props.logoutVoter}
                                getVoterAddress={this.props.getVoterAddress}
                                lastError={this.props.lastError}
                                IDnumberSelected={this.props.IDnumberSelected}
                            />
                        </Suspense>
                    </>
                );
            default:
                return (
                    <>
                        <Suspense fallback={<LoadingSpinner />}>
                            <DetectAccount
                                updateLoginPage={this.props.updateLoginPage}
                                lastError={this.props.lastError}
                                checkVoter={this.props.checkVoter}
                            />
                        </Suspense>
                    </>
                );
        }
    }
}

export default Login;
