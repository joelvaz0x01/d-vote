import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectLogin: false,
            redirectVote: false,
            redirectResults: false
        }
    }
    
    render() {
        const { candidates, totalVotes, voter, votePage } = this.props;
        const { redirectLogin, redirectVote, redirectResults } = this.state;
        if (redirectLogin) { return <Redirect to="/login" /> };
        if (redirectVote) { return <Redirect to="/vote" /> };
        if (redirectResults) { return <Redirect to="/results" /> };
        if (!voter) {
            return (
                <>
                    <p>Bem-vindo à plataforma <strong>dVote - O seu voto seguro</strong>.</p>
                    <p>Número total de votos até agora: <strong>{totalVotes} votos</strong>.</p>
                    <p>Lista de candidatos:</p>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Candidatos</th>
                            </tr>
                        </thead>
                        <tbody>
                            { candidates.map((candidate, id) => {
                                return (
                                    <tr key={id}>
                                        <td>{candidate.name}</td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </Table>
                    <Button variant="success" onClick={() => { this.setState({ redirectLogin: true }) }} block>Login</Button>
                    <Button variant="success" onClick={() => { this.setState({ redirectResults: true }) }} block>Resultados</Button>
                </>
            )
        } else {
            return (
                <>
                    <p>Seja bem-vindo:<br></br><strong>{voter}</strong></p>
                    <p>Número total de votos até agora: <strong>{totalVotes} votos</strong>.</p>
                    <Button variant="success" onClick={() => { this.setState({ redirectVote: true }) }} block>
                        { votePage === 0 ? 'Votar agora' : 'Continuar o voto' }
                    </Button>
                </>
            )
        }
    }
}

export default Welcome;
