import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';


class VoteConfirmation extends Component {

    logoutProcess = () => {
        this.props.logoutVoter();
        this.props.setRedirectAuto(true)
    }

    render() {
        const { candidateName } = this.props;
        return (
            <div>
                <p>Votou com sucesso em <strong>{candidateName}</strong>.</p>
                <p>Os resultados serão exibidos assim que o tempo de voto expire.</p>
                <p>Obrigado por utilizar a plataforma <strong>dVote - O seu voto seguro</strong>.</p>
                <Button variant="success" onClick={ this.logoutProcess } block>Logout</Button>
            </div>
        )
    }
}

export default VoteConfirmation;
