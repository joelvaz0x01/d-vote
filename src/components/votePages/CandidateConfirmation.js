import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class CandidateConfirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moveForward: null
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.moveForward) {
            this.props.updateVotePage(2);
        } else {
            this.props.updateVotePage(0);
        }
    };
    
    render() {
        const { candidateName } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <p>Opção selecionada: <strong>{candidateName}</strong>.</p>
                <p>Para <strong>votar</strong> no candidato acima clique em <strong>seguinte</strong>.</p>
                <p>Caso queira <strong>alterar o voto</strong> clique em <strong>anterior</strong>.</p>
                <Row xs={1} md={2}>
                    <Form.Group as={Col}>
                        <Button variant="success" type="submit" onClick={() => this.setState({ moveForward: false })} block>
                            Anterior
                        </Button>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button variant="success" type="submit" onClick={() => this.setState({ moveForward: true })} block>
                            Seguinte
                        </Button>
                    </Form.Group>
                </Row>
            </Form>
        )
    }
}

export default CandidateConfirmation;
