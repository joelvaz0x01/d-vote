import React, { Component, lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Redirect, Link } from "react-router-dom";

const DetectAccount = lazy(() => import('./loginPages/DetectAccount'));
const CreateAccount = lazy(() => import('./loginPages/CreateAccount'));
const LoginAccount = lazy(() => import('./loginPages/LoginAccount'));

class Login extends Component {

    componentDidMount() {
        if (this.props.endCountdown.length === 1) {
            this.redirectLogin = setTimeout(() => { this.setState({ redirectAuto: true }); }, 5000);
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
        const { voter, endCountdown } = this.props;
        const { redirectAuto } = this.state;
        if (voter || redirectAuto) { return <Redirect to="/" /> }
        if (endCountdown.length === 1) {
            return (
                <>
                    <h2>Não é possivel fazer login</h2>
                    <p>
                        Será redirecionado dentro de 5 segundos
                        <br></br>
                        ou também pode clicar <Link to="/">aqui</Link>
                    </p>
                </>
            )
        } else {
            switch(this.props.loginPage) {
                case 1:
                    return (
                        <>
                            <Suspense fallback={<LoadingSpinner />}>
                                <CreateAccount
                                    logoutVoter={this.props.logoutVoter}
                                    getVoterAddress={this.props.getVoterAddress}
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
                                    checkVoter={this.props.checkVoter}
                                />
                            </Suspense>
                        </>
                    );
            }
        }
        
    }
}

export default Login;
