import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class DetectAccount extends Component {

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
            this.props.checkVoter(this.IDnumber.value);
        }
        this.setState({ validated: true });
    };

    render() {
        const { lastError } = this.props;
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
                        <Form.Label>Número de Identificação Civil</Form.Label>
                        <Form.Control
                            required
                            ref={input => { this.IDnumber = input }}
                            type="number"
                            placeholder="Número de Identificação Civil"
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor introduza um Número de Identificação Civil válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="success" type="submit" block>
                        Login
                    </Button>
                </Form>
            </>
        )
    }
}

export default DetectAccount;
