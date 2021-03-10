import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';

class Results extends Component {

    componentDidMount() {
        this.props.updateCandidates();
    }

    constructor(props) {
        super(props);
        this.state = {
            redirectHome: false
        }
    }

    render() {
        const { totalVotes, endCountdown, candidates, maxUsers } = this.props;
        const { redirectHome } = this.state;
        
        if (redirectHome === true) { return <Redirect to="/" /> }
        if (endCountdown.length !== 1 && totalVotes < maxUsers) {
            return (
                <>
                    <h2>Eleições ainda em curso...</h2>
                    <p>
                        Faltam <strong>{endCountdown[0]}h {endCountdown[1]}m {endCountdown[2]}s</strong> para os resultados serem exibidos.
                        <br></br>
                        Faltam votar {Number(maxUsers - totalVotes)} eleitores.
                    </p>
                    <Button variant="success" onClick={() => { this.setState({ redirectHome: true }) }} block>
                        Voltar ao início
                    </Button>
                </>
            )
        } else {
            return (
                <>
                    {candidates.length === 5
                        ? <>
                            <p>Resultados finais:</p>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Candidatos</th>
                                        <th>Votos</th>
                                        <th>Percentagem de votos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { candidates.map((candidate, id) => {
                                        return (
                                            <tr key={id}>
                                                <td>{candidate.name}</td>
                                                <td>{candidate.voteCount}</td>
                                                <td>{Number(candidate.voteCount / totalVotes * 100).toFixed(2)}%</td>
                                            </tr>
                                        )
                                    }) }
                                </tbody>
                            </Table>
                            <Table striped bordered hover size="sm">
                                <tbody>
                                    <tr>
                                        <th>Abstenção</th>
                                        <td>{Number(100 - totalVotes * 100 / maxUsers).toFixed(2)}%</td>
                                    </tr>
                                    <tr>
                                        <th>Total de votos</th>
                                        <td>{totalVotes} votos</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Button variant="success" onClick={() => { this.setState({ redirectHome: true }) }} block>
                                Voltar ao início
                            </Button>
                        </>
                        : <LoadingSpinner />
                    }
                </>
            )
        }        
    }
}

export default Results;
