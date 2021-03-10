import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


class CandidateSelection extends Component {

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.validateCandidate(this.candidateID.value);
    };

    render() {
        const { lastError, candidates } = this.props;
        return (
            <>
                { lastError
                    ? <Alert variant="danger">
                        {lastError}
                    </Alert>
                    : <></>
                }
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="candidate">
                        <Form.Label>Selecione o candidato:</Form.Label>
                        <Form.Control as="select" ref={input => { this.candidateID = input }}>
                            { candidates.map((candidate, id) => {
                                return <option key={id} value={id}>{candidate.name}</option>
                            }) }
                        </Form.Control>
                    </Form.Group>
                    <Button variant="success" type="submit" block>
                        Seguinte
                    </Button>
                </Form>
            </>
        )
    }
}

export default CandidateSelection;
