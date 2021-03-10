import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

class VoteProcess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            buttonProcess: false
        }
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            this.props.makeVote(this.props.voter, this.props.candidateID, this.password.value);
        }
        this.setState({ validated: true });
        this.setState({ buttonProcess: false });
    };
    
    render() {
        const { lastError, candidateName } = this.props;
        return (
            <>
                { lastError
                    ? <Alert variant="danger">
                        {lastError}
                    </Alert>
                    : <></>
                }
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="voter-password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            ref={input => { this.password = input }}
                            type="password"
                            placeholder="Password"
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor introduza uma password válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="success" type="submit" onClick={() => this.setState({ buttonProcess: true })} block>
                        { this.state.buttonProcess
                            ? <>
                                <Spinner
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                /> Processando voto
                            </>
                            : <>Votar em {candidateName}</>
                        }
                    </Button>
                </Form>
            </>
        )
    }
}

export default VoteProcess;
