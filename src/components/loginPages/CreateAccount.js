import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class CreateAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false
        }
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            this.props.getVoterAddress(this.password.value, this.passwordConfirmation.value);
        }
        this.setState({ validated: true });
    };
    
    render() {
        const { lastError, IDnumberSelected } = this.props;
        return (
            <>
                { lastError
                    ? <Alert variant="danger">
                        {lastError}
                    </Alert>
                    : <></>
                }
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="id-number">
                        <Form.Label>Número de Identificação Civil: <strong>{IDnumberSelected}</strong></Form.Label>
                    </Form.Group>
                    <Form.Group controlId="id-password">
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
                    <Form.Group controlId="id-password-confirmation">
                        <Form.Label>Confirmar password</Form.Label>
                        <Form.Control
                            required
                            ref={input => { this.passwordConfirmation = input }}
                            type="password"
                            placeholder="Confirmar password"
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor introduza uma password válida.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row xs={1} md={2}>
                        <Form.Group as={Col}>
                            <Button variant="success" type="submit" onClick={() => this.props.logoutVoter()} block>
                                Anterior
                            </Button>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant="success" type="submit" block>
                                Login
                            </Button>
                        </Form.Group>
                    </Row>
                </Form>
            </>
        )
    }
}

export default CreateAccount;
